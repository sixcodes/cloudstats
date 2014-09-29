from django.contrib.auth.models import User
from django.core.cache import cache
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status, mixins
from rest_framework import decorators

from api.models import Server, Stats
from api.serializers import UserSerializer, ServerSerializer, StatsSerializer


def _get_client_ip_address(request):
    return request.META.get('REMOTE_ADDR', None)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ServerView(mixins.CreateModelMixin,
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

    @decorators.detail_route(methods=['get', 'post'])
    def process(self, request, *args, **kwargs):
        return Response(status=201, data={"detail": "Created."})
        pass


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
