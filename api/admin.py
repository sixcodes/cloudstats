from django.contrib import admin
from api.models import Server


class ServerAdmin(admin.ModelAdmin):
    pass

admin.site.register(Server, ServerAdmin)