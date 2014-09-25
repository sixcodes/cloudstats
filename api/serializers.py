# coding=utf-8
from django.contrib.auth.models import User, Group
from rest_framework import serializers
from api.models import Server


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class ServerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Server
        fields = ('name', 'ipaddress', 'supervisord_port', 'supervisord_pwd')
