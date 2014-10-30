from django.shortcuts import render_to_response, redirect
from django.conf import settings

def index(request):
    if request.user.is_authenticated():
        return redirect(settings.SOCIAL_AUTH_LOGIN_REDIRECT_URL)
    return render_to_response('index.html')