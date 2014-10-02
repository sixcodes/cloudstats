import os
from xmlrpclib import ServerProxy

from django.core.cache import cache
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import Server, Stats, ServerProcess
from api.serializers import ServerSerializer, StatsSerializer


def _get_client_ip_address(request):
    return request.META.get('REMOTE_ADDR', None)


def _get_xml_server_proxy(ipaddress):
    return ServerProxy("http://{user}:{pwd}@{ipaddress}:{port}/RPC2".format(
        user=os.environ['CLOUDSTATS_SUPERVISORD_USER'],
        pwd=os.environ['CLOUDSTATS_SUPERVISORD_PWD'],
        ipaddress=ipaddress,
        port=os.environ['CLOUDSTATS_SUPERVISORD_PORT'])
    )


class ServerView(NestedViewSetMixin,
                 mixins.CreateModelMixin,
                 mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):

    """
    Manage basic information about a server.
    Also used to register a new server
    """

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    queryset = Server.objects.all()

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
    Manage all processes fo a given server
    """

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    queryset = ServerProcess.objects.all()

    def list(self, request, *args, **kwargs):
        server_id = kwargs['parent_lookup_server']
        server = Server.objects.get(id=server_id)
        xmlrpc = _get_xml_server_proxy(server.ipaddress)
        data = xmlrpc.supervisor.getAllProcessInfo()
        try:
            return Response(data=data)
        except Exception as e:
            print e

    def create(self, request, *args, **kwargs):
        server_id = kwargs['parent_lookup_server']
        server = Server.objects.get(id=server_id)

        xmlrpc = _get_xml_server_proxy(server.ipaddress)

        process_name = self._get_full_process_name(request.DATA, kwargs['pk'])
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
        return Response(status=202, data=resp)

    def _get_full_process_name(self, reques_data, pname):
        process_name = pname.replace("-", "/")
        group = reques_data.get("group")
        if group:
            full_process_name = "{}:{}".format(group, process_name)
        else:
            full_process_name = process_name

        return full_process_name


class StatsView(viewsets.ModelViewSet):
    """
    Post new values for stats: mem, load, disk space, etc
    """
    queryset = Stats.objects.all()
    serializer_class = StatsSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        ip_address = _get_client_ip_address(request)
        server = Server.objects.filter(ipaddress=ip_address).all()
        if not server.exists():
            return Response(status=400)

        key = "stats-{}-{}".format(server[0].id, server[0].ipaddress)
        cache.set(key, request.DATA)
        return Response(request.DATA, status.HTTP_201_CREATED)
