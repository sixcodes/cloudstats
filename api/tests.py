from django.test import TestCase, client
from django.core.urlresolvers import reverse
import json

from api.models import Server, User, Token


class ServerAPITest(TestCase):

    def setUp(self):
        self.u = User.objects.create_user("testuser", password="secret")
        self.client = client.Client()

    def test_create_new_server(self):
        server_data = {
            "name": "etl",
            "ipaddress": "127.0.0.1",
            "supervisord_port": 9000,
            "supervisord_pwd": "sievera",
        }
        token = Token.objects.filter(user=self.u).all()[0]
        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(server_data), HTTP_AUTHORIZATION="Token {}".format(token.key))
        self.assertEqual(201, response.status_code)
        etl_server = Server.objects.filter(name="etl").all()[0]
        self.assertEqual(etl_server.name, server_data['name'])
        self.assertEqual(etl_server.ipaddress, server_data['ipaddress'])
        self.assertEqual(etl_server.supervisord_port, server_data['supervisord_port'])
        self.assertEqual(etl_server.supervisord_pwd, server_data['supervisord_pwd'])