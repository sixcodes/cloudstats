from django.shortcuts import render_to_response
from rest_framework.authentication import Token
from rest_framework.response import Response
from rest_framework.status import HTTP_403_FORBIDDEN


def index(request):
    return render_to_response('index.html')


def token(request):
    if request.user.is_authenticated():
        user_token = Token.objects.get(user=request.user)
        return Response(data={"user_token": user_token.key}, status=200)
    return Response(status=HTTP_403_FORBIDDEN)