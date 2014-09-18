#!/usr/bin/env python
import os
import sys

# Instala o pymysql no lugar do MySQLdb
import pymysql
pymysql.install_as_MySQLdb()


if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cloudstats.settings")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
