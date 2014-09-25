from django.contrib.auth.models import User
from rest_framework import viewsets, permissions

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
