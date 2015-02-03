# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20141111_2115'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permission',
            name='server',
            field=models.ForeignKey(related_name=b'permissions', to='api.Server'),
        ),
        migrations.AlterField(
            model_name='server',
            name='ipaddress',
            field=models.CharField(max_length=32),
        ),
    ]
