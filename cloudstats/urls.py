from django.contrib import admin
from django.conf.urls import patterns, include, url
from api import views


from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"servers", views.ServerView)
router.register(r"stats", views.StatsView)


urlpatterns = patterns('',
    url(r'^$', 'angularjs.views.index'),
    url(r'^api-login', 'rest_framework.authtoken.views.obtain_auth_token', name='get-token'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
)
