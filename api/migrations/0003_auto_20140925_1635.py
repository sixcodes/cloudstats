# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_stats'),
    ]

    operations = [
        migrations.AlterField(
            model_name='server',
            name='supervisord_port',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='server',
            name='supervisord_pwd',
            field=models.CharField(max_length=32, null=True),
        ),
    ]
