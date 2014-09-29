import os
from xmlrpclib import ServerProxy

from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status, mixins, generics
from rest_framework import decorators
from rest_framework_extensions.mixins import NestedViewSetMixin

from api.models import Server, Stats, ServerProcess
from api.serializers import UserSerializer, ServerSerializer, StatsSerializer


def _get_client_ip_address(request):
    return request.META.get('REMOTE_ADDR', None)


def _get_xml_server_proxy(ipaddress):
    return ServerProxy("http://{user}:{pwd}@{ipaddress}:{port}/RPC2".format(
        user=os.environ['CLOUDSTATS_SUPERVISORD_USER'],
        pwd=os.environ['CLOUDSTATS_SUPWERVISORD_PWD'],
        ipaddress=ipaddress,
        port=os.environ['CLOUDSTATS_SUPERVISORD_PORT'])
    )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ServerView(NestedViewSetMixin,
                 mixins.CreateModelMixin,
                 mixins.ListModelMixin,
                 mixins.RetrieveModelMixin,
                 viewsets.GenericViewSet):
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

    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    queryset = ServerProcess.objects.all()

    def list(self, request, *args, **kwargs):
        server_id = kwargs['parent_lookup_server']
        server = Server.objects.get(id=server_id)
        xmlrpc = _get_xml_server_proxy(server.ipaddress)
        return Response(data=xmlrpc.supervisor.getAllProcessInfo())

    def create(self, request, *args, **kwargs):
        return Response(status=202, data={"detail": "OK"})


class StatsView(viewsets.ModelViewSet):
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
