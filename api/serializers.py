# coding=utf-8
from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Server, Stats


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class ServerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Server
        fields = ('name', 'ipaddress', 'supervisord_port', 'supervisord_pwd')


class StatsSerializer(serializers.HyperlinkedModelSerializer):
    server = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = Stats
        fields = ('mem', 'load', 'swap', 'uptime', 'server')
