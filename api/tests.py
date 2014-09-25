from decimal import Decimal
from django.test import TestCase, client
from django.core.urlresolvers import reverse
from django.core.cache import cache
import json

from api.models import Server, User, Token, Stats


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


class StatsAPITest(TestCase):

    def setUp(self):
        self.u = User.objects.create_user("testuser", password="secret")
        self.token = Token.objects.filter(user=self.u).all()[0]
        self.client = client.Client()

    def test_create_stats_for_server(self):
        stats_data = {
            "load": 80.2,
            "mem": 60.3,
            "swap": 10.2,
            "uptime": 10000,
        }
        server = Server(name="server", ipaddress="127.0.0.1")
        server.save()
        cache_key = "stats-{}-{}".format(server.id, server.ipaddress)

        response = self.client.post(reverse('stats-list'), content_type='application/json', data=json.dumps(stats_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(201, response.status_code)

        saved_stats = cache.get(cache_key)
        self.assertIsNotNone(saved_stats)
        self.assertDictEqual(saved_stats, stats_data)

        stats_data['uptime'] = 20000
        response = self.client.post(reverse('stats-list'), content_type='application/json', data=json.dumps(stats_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(201, response.status_code)

        saved_stats = cache.get(cache_key)
        self.assertEqual(20000, saved_stats['uptime'])

    def test_create_stats_for_unknown_server(self):
        stats_data = {
            "load": 80.2,
            "mem": 60.3,
            "swap": 10.2,
            "uptime": 10000,
        }

        response = self.client.post(reverse('stats-list'), content_type='application/json', data=json.dumps(stats_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(400, response.status_code)