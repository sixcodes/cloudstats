from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.core.cache import cache


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Server(models.Model):

    name = models.CharField(max_length=64, null=False, blank=False)
    ipaddress = models.IPAddressField()
    supervisord_port = models.IntegerField(null=True, blank=True)
    supervisord_pwd = models.CharField(max_length=32, null=True, blank=True)

    def fetch_stats(self):
        return cache.get(self._get_stats_key())

    def _get_stats_key(self):
        return "stats-{}-{}".format(self.id, self.ipaddress)


class ServerProcess(models.Model):

    name = models.CharField(max_length=64, null=False, blank=False)
    group = models.CharField(max_length=64, null=True, blank=True)
    status = models.CharField(max_length=64, null=True, blank=True)


class Stats(models.Model):

    mem = models.DecimalField(decimal_places=2, max_digits=5)
    load = models.DecimalField(decimal_places=2, max_digits=5)
    swap = models.DecimalField(decimal_places=2, max_digits=5)
    uptime = models.BigIntegerField()