from django.contrib import admin
from django.conf.urls import patterns, include, url
from api import views

from rest_framework import routers
from rest_framework_extensions.routers import ExtendedDefaultRouter
import social_auth

router = ExtendedDefaultRouter(trailing_slash=False)
router.register(r"servers", views.ServerView)\
      .register(r"processes", views.ServerProcessView, base_name="server-processes", parents_query_lookups=['server'])

router.register(r"stats", views.StatsView)


urlpatterns = patterns('',
    url(r'^social/', include('social.apps.django_app.urls', namespace='social')),
    url(r'^$', 'angularjs.views.index'),
    url(r'^api-login', 'rest_framework.authtoken.views.obtain_auth_token', name='get-token'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^docs/', include('rest_framework_swagger.urls')),
    url(r'^api/', include(router.urls)),
)
