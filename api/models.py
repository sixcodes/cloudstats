from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class Server(models.Model):

    name = models.CharField(max_length=64, null=False, blank=False)
    ipaddress = models.IPAddressField()
    supervisord_port = models.IntegerField(null=True)
    supervisord_pwd = models.CharField(max_length=32, null=True)


class Stats(models.Model):

    mem = models.DecimalField(decimal_places=2, max_digits=5)
    load = models.DecimalField(decimal_places=2, max_digits=5)
    swap = models.DecimalField(decimal_places=2, max_digits=5)
    uptime = models.BigIntegerField()
    server = models.ForeignKey(Server)