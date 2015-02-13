# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20150203_2123'),
    ]

    operations = [
        migrations.CreateModel(
            name='CronEntry',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('servername', models.CharField(max_length=128)),
                ('cronname', models.CharField(max_length=128)),
                ('command', models.CharField(max_length=128)),
                ('minute', models.CharField(max_length=32)),
                ('hour', models.CharField(max_length=32)),
                ('day', models.CharField(max_length=32)),
                ('month', models.CharField(max_length=32)),
                ('weekday', models.CharField(max_length=32)),
                ('user', models.CharField(max_length=128)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
