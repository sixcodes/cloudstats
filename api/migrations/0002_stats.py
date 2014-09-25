# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stats',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('mem', models.DecimalField(max_digits=5, decimal_places=2)),
                ('load', models.DecimalField(max_digits=5, decimal_places=2)),
                ('swap', models.DecimalField(max_digits=5, decimal_places=2)),
                ('uptime', models.BigIntegerField()),
                ('server', models.ForeignKey(to='api.Server')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
