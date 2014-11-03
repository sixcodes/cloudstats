# coding=utf-8
from django.http.response import HttpResponse


def check_sieve(strategy, user, request, **kwargs):
    if "@sieve.com.br" not in kwargs.get("uid"):
        return HttpResponse("So pode @sieve@!")