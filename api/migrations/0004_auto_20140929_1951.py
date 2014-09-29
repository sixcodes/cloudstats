# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20140925_1635'),
    ]

    operations = [
        migrations.CreateModel(
            name='ServerProcess',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=64)),
                ('group', models.CharField(max_length=64, null=True, blank=True)),
                ('status', models.CharField(max_length=64, null=True, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='stats',
            name='server',
        ),
        migrations.AlterField(
            model_name='server',
            name='supervisord_port',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='server',
            name='supervisord_pwd',
            field=models.CharField(max_length=32, null=True, blank=True),
        ),
    ]
