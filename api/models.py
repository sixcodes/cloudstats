from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.views.decorators.cache import cache_control
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.core.cache import cache


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Server(models.Model):

    name = models.CharField(max_length=64, null=False, blank=False)
    ipaddress = models.CharField(max_length=32, null=False, blank=False)
    supervisord_port = models.IntegerField(null=True, blank=True)
    supervisord_pwd = models.CharField(max_length=32, null=True, blank=True)

    def fetch_stats(self):
        cache_ = cache.get(self._get_stats_key(), {})
        return {
            "load": cache_.get("load"),
            "mem": cache_.get("mem"),
            "swap": cache_.get("swap"),
            "uptime": cache_.get("uptime"),
        }

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


class Permission(models.Model):

    name = models.CharField(max_length=128, null=False, blank=False)
    server = models.ForeignKey(Server, null=False, blank=False, related_name='permissions')
    process_name = models.CharField(max_length=256, null=True, blank=True)
    user = models.ForeignKey(User, null=False, blank=False)


class CronEntry(models.Model):

    servername = models.CharField(max_length=128, null=False, blank=False)
    cronname = models.CharField(max_length=128, null=False, blank=False)
    command = models.CharField(max_length=128, null=False, blank=False)
    minute = models.CharField(max_length=32, null=False, blank=False)
    hour = models.CharField(max_length=32, null=False, blank=False)
    day = models.CharField(max_length=32, null=False, blank=False)
    month = models.CharField(max_length=32, null=False, blank=False)
    weekday = models.CharField(max_length=32, null=False, blank=False)
    user = models.CharField(max_length=128, null=False, blank=False)
