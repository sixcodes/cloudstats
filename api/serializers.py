# coding=utf-8
from django.contrib.auth.models import User
from rest_framework import serializers
from django.core.cache import cache

from api.models import Server, Stats


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups')


class ServerSerializer(serializers.HyperlinkedModelSerializer):

    stats = serializers.Field(source='fetch_stats')

    class Meta:
        model = Server
        fields = ('id', 'name', 'ipaddress', 'supervisord_port', 'supervisord_pwd', 'stats')


class StatsSerializer(serializers.HyperlinkedModelSerializer):
    server = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = Stats
        fields = ('mem', 'load', 'swap', 'uptime', 'server')
