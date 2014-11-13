# coding=utf-8


class ServerReadPermission(object):

    name = "CanReadServerPermission"
    verbose_name = "Can view all server processes"


class CanInteractWithProcessPermission(object):

    name = "CanInteractWithProcessPermission"
    verbose_name = "Can Start/Stop/Restart a server process"
