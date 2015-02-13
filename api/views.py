import os
from xmlrpclib import ServerProxy

from django.core.cache import cache
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import Server, Stats, ServerProcess, Permission, CronEntry
from api import permissions
from api.serializers import ServerSerializer, StatsSerializer, CronEntrySerializer


def _get_client_ip_address(request):
    return request.META.get('REMOTE_ADDR', None)


def _get_xml_server_proxy(ipaddress):
    return ServerProxy("http://{user}:{pwd}@{ipaddress}:{port}/RPC2".format(
        user=os.environ['CLOUDSTATS_SUPERVISORD_USER'],
        pwd=os.environ['CLOUDSTATS_SUPERVISORD_PWD'],
        ipaddress=ipaddress,
        port=os.environ['CLOUDSTATS_SUPERVISORD_PORT'])
    )


def _apply_process_permissions(data, server, user):
    data_ = data
    if not isinstance(data_, list):
        data_ = [data_]
    for process in data_:
        permission_exists = Permission.objects.all().filter(user=user,
                                                            name=permissions.CanInteractWithProcessPermission.name,
                                                            server=server, process_name=_get_full_process_name(process, process['name']))\
            .exists()
        if user.is_superuser or  permission_exists:
            process['can_interact'] = True
    return data


def _get_full_process_name(data, pname):
    process_name = pname.replace("-", "/")
    group = data.get("group")
    if group:
        full_process_name = "{}:{}".format(group, process_name)
    else:
        full_process_name = process_name

    return full_process_name



class ServerView(NestedViewSetMixin,
                 mixins.CreateModelMixin,
                 mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):

    """
    Manage basic information about a server.
    Also used to register a new server
    """

    serializer_class = ServerSerializer
    queryset = Server.objects.all()
    paginate_by = 100

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset
        return self.queryset.filter(permissions__user=self.request.user.id, permissions__name=permissions.ServerReadPermission.name)

    def create(self, request, *args, **kwargs):
        remote_addr = _get_client_ip_address(request)
        if Server.objects.filter(ipaddress=remote_addr).exists():
            return Response(status=status.HTTP_201_CREATED)
        request.DATA['ipaddress'] = remote_addr
        return super(ServerView, self).create(request, *args, **kwargs)


class ServerProcessView(NestedViewSetMixin,
                        generics.CreateAPIView,
                        generics.ListAPIView,
                        generics.RetrieveAPIView,
                        viewsets.GenericViewSet):
    """
    Manage all processes of a given server
    """

    serializer_class = ServerSerializer
    queryset = ServerProcess.objects.all()

    def _processes_by_group(self, data):
        groups_ = {}
        for process in data:
            groups_.setdefault(process['group'], list()).append(process)
        return groups_

    def list(self, request, *args, **kwargs):
        server_id = kwargs['parent_lookup_server']
        server = Server.objects.get(id=server_id)
        xmlrpc = _get_xml_server_proxy(server.ipaddress)
        data = xmlrpc.supervisor.getAllProcessInfo()

        filtered_data = _apply_process_permissions(data, server, request.user)
        data = {
            'processes': filtered_data,
            'by_group': self._processes_by_group(filtered_data)
        }
        try:
            return Response(data=data)
        except Exception as e:
            print e

    def create(self, request, *args, **kwargs):
        server_id = kwargs['parent_lookup_server']
        server = Server.objects.get(id=server_id)

        xmlrpc = _get_xml_server_proxy(server.ipaddress)

        process_name = _get_full_process_name(request.DATA, kwargs['pk'])
        action = request.DATA.get("action")

        resp = {}

        if action == "start":
            xmlrpc.supervisor.startProcess(process_name, True)
        elif action == "stop":
            xmlrpc.supervisor.stopProcess(process_name, True)
        elif action == "restart":
            xmlrpc.supervisor.stopProcess(process_name, True)
            xmlrpc.supervisor.startProcess(process_name, True)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        resp = xmlrpc.supervisor.getProcessInfo(process_name)
        resp = _apply_process_permissions(resp, server, request.user)
        return Response(status=202, data=resp)


class StatsView(viewsets.ModelViewSet):
    """
    Post new values for stats: mem, load, disk space, etc
    """
    queryset = Stats.objects.all()
    serializer_class = StatsSerializer

    def create(self, request, *args, **kwargs):
        ip_address = _get_client_ip_address(request)
        server = Server.objects.filter(ipaddress=ip_address).all()
        if not server.exists():
            return Response(status=400)

        key = "stats-{}-{}".format(server[0].id, server[0].ipaddress)
        cache.set(key, request.DATA)
        return Response(request.DATA, status.HTTP_201_CREATED)


class CronEntryView(viewsets.ModelViewSet):

    queryset = CronEntry.objects.all()
    serializer_class = CronEntrySerializer

    def create(self, request, *args, **kwargs):
        return Response(request.DATA, status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        return Response(request.DATA, status.HTTP_200_OK)
