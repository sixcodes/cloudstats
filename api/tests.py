from django.test import TestCase, client
from django.core.urlresolvers import reverse
import json

from api.models import Server, User, Token


class ServerAPITest(TestCase):

    def setUp(self):
        self.u = User.objects.create_user("testuser", password="secret")
        self.token = Token.objects.filter(user=self.u).all()[0]
        self.client = client.Client()
        self.server_data = {
            "name": "etl",
            "ipaddress": "127.0.0.1",
            "supervisord_port": 9000,
            "supervisord_pwd": "sievera",
        }

    def test_create_new_server(self):
        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(self.server_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(201, response.status_code)
        etl_server = Server.objects.filter(name="etl").all()[0]
        self.assertEqual(etl_server.name, self.server_data['name'])
        self.assertEqual(etl_server.ipaddress, self.server_data['ipaddress'])
        self.assertEqual(etl_server.supervisord_port, self.server_data['supervisord_port'])
        self.assertEqual(etl_server.supervisord_pwd, self.server_data['supervisord_pwd'])

    def test_donot_create_servers_with_same_ip_address(self):
        server = Server(**self.server_data)
        server.save()
        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(self.server_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(400, response.status_code)

    def test_donot_trust_data_ipaddress(self):
        """
        Get the IP address from the REMOTE_ADDR request header
        :return:
        """
        self.server_data['ipaddress'] = '8.8.8.8'
        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(self.server_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        servers = Server.objects.filter(ipaddress=self.server_data['ipaddress']).all().count()
        self.assertEqual(0, servers)
        self.assertEqual(201, response.status_code)
        server = Server.objects.all()[0]
        self.assertEqual("127.0.0.1", server.ipaddress)

