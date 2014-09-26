# coding=utf-8


class SetRemoteAddrMiddleware(object):
    def process_request(self, request):
        if request.META.has_key('HTTP_X_REAL_IP'):
            request.META['REMOTE_ADDR'] = request.META['HTTP_X_REAL_IP']