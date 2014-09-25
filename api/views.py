from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status

from api.models import Server
from api.serializers import UserSerializer, ServerSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)


class ServerView(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ServerSerializer
    queryset = Server.objects.all()

    def create(self, request, *args, **kwargs):
        remote_addr = request.META.get('REMOTE_ADDR', None)
        if Server.objects.filter(ipaddress=remote_addr).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        request.DATA['ipaddress'] = remote_addr
        return super(viewsets.ModelViewSet, self).create(request, *args, **kwargs)
