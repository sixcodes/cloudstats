from django.conf.urls import patterns, include, url
from django.contrib import admin
from api import views


from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)


urlpatterns = patterns('',
    url(r'^$', 'angularjs.views.index'),
    url(r'^api-login/', 'rest_framework.authtoken.views.obtain_auth_token'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
)
