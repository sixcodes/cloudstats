from django.shortcuts import render_to_response
from django.http.response import HttpResponse
import json
from rest_framework.authentication import Token
from rest_framework.status import HTTP_403_FORBIDDEN
from rest_framework.renderers import JSONRenderer


def index(request):
    return render_to_response('index.html')


def token(request):
    if request.user.is_authenticated():
        user_token = Token.objects.get(user=request.user)
        data = {"token": user_token.key}

        token_response = HttpResponse(content=json.dumps(data))
        token_response.accepted_renderer = JSONRenderer()
        return token_response
    return HttpResponse(status=HTTP_403_FORBIDDEN)