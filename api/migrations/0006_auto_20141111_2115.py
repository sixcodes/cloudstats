# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_permission'),
    ]

    operations = [
        migrations.RenameField(
            model_name='permission',
            old_name='server_id',
            new_name='server',
        ),
        migrations.RenameField(
            model_name='permission',
            old_name='user_id',
            new_name='user',
        ),
    ]
