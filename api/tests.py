#encoding: utf-8

import json
import mock
import os

from django.test import TestCase, client
from django.core.urlresolvers import reverse
from django.core.cache import cache

from api.models import Server, User, Token, Permission
import api.views
import api.permissions

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

    def exchange_sessionid_for_auth_token(self):
        self.assertTrue(self.client.login(username="testuser", password="secret"))

        response = self.client.get("/token", Accept='application/json;')
        self.assertEqual(self.token.key, json.loads(response.content)['token'])


    def test_create_new_server(self):
        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(self.server_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(201, response.status_code)
        etl_server = Server.objects.filter(name="etl").all()[0]
        self.assertEqual(etl_server.name, self.server_data['name'])
        self.assertEqual(etl_server.ipaddress, self.server_data['ipaddress'])
        self.assertEqual(etl_server.supervisord_port, self.server_data['supervisord_port'])
        self.assertEqual(etl_server.supervisord_pwd, self.server_data['supervisord_pwd'])

    def test_create_same_server_twice(self):
        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(self.server_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(201, response.status_code)
        etl_server = Server.objects.filter(name="etl").all()[0]
        self.assertEqual(etl_server.name, self.server_data['name'])
        self.assertEqual(etl_server.ipaddress, self.server_data['ipaddress'])

        response = self.client.post(reverse('server-list'), content_type='application/json', data=json.dumps(self.server_data), HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(201, response.status_code)
        all_servers = Server.objects.filter(name="etl").all().count()
        self.assertEqual(1, all_servers)

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

    def test_list_servers(self):
        server = Server(**self.server_data)
        server.save()

        response = self.client.get(reverse('server-list'), content_type='application/json', HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(200, response.status_code)

    def test_retrieve_server_with_stats(self):
        stats_data = {
            u"load": 80.2,
            u"mem": 60.3,
            u"swap": 10.2,
            u"uptime": 10000,
        }
        server = Server(name="server", ipaddress="127.0.0.1")
        server.save()

        permission = Permission(name=api.permissions.ServerReadPermission.name, user=self.u, server=server)
        permission.save()


        cache_key = "stats-{}-{}".format(server.id, server.ipaddress)
        cache.set(cache_key, stats_data)
        response = self.client.get(reverse('server-detail', args=(server.id,)), content_type='application/json', HTTP_AUTHORIZATION="Token {}".format(self.token.key))
        self.assertEqual(200, response.status_code)

        self.assertDictEqual(stats_data, json.loads(response.content)['stats'])


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


class ServerProcessTest(TestCase):

    def setUp(self):
        self.u = User.objects.create_user("testuser", password="secret")
        self.token = Token.objects.filter(user=self.u).all()[0]
        self.client = client.Client()
        self.s = Server(name="localhost", ipaddress="127.0.0.1")
        self.s.save()

        self.env_values = {"CLOUDSTATS_SUPERVISORD_PORT": "9000",
                           "CLOUDSTATS_SUPERVISORD_USER": "sieve",
                           "CLOUDSTATS_SUPERVISORD_PWD": "pwd"}
        self.env_values.update(os.environ)
        self.env_patcher = mock.patch.dict('os.environ', self.env_values)
        self.env_patcher.start()

    def test_list_all_server_processes(self):
        server_id = self.s.id

        process_list_info = [{'description': 'pid 9437, uptime 1:10:11', 'exitstatus': 0, 'group': 'reprice',
                              'name': 'reprice_worker', 'pid': 9437, 'statename': 'RUNNING'},
                             {'description': 'pid 2345, uptime 1:10:11', 'exitstatus': 0, 'group': 'etl', 'name': 'etl',
                              'pid': 2345, 'statename': 'RUNNING'},
                             ]

        server_proxy_instance_mock = mock.Mock()
        with mock.patch.object(api.views, "ServerProxy", return_value=server_proxy_instance_mock) as serverProxy_mock:

            server_proxy_instance_mock.supervisor.getAllProcessInfo.return_value = process_list_info

            resposnse = self.client.get(reverse("server-processes-list", args=(server_id,)),
                                        content_type='application/json',
                                        HTTP_AUTHORIZATION="Token {}".format(self.token.key))
            self.assertEqual(200, resposnse.status_code)

            self.assertEqual([mock.call("http://sieve:pwd@127.0.0.1:9000/RPC2")], serverProxy_mock.call_args_list)
            self.assertEqual([mock.call()], server_proxy_instance_mock.supervisor.getAllProcessInfo.call_args_list)
            self.assertListEqual(process_list_info, json.loads(resposnse.content))

    def test_check_calling_right_action_start(self):
        """
        Actions: "start", "stop", "restart"
        :return:
        """

        payload = {
            "action": "start",
            "group": "crawler",

        }

        server_proxy_instance_mock = mock.Mock()
        with mock.patch.object(api.views, "ServerProxy", return_value=server_proxy_instance_mock) as serverProxy_mock:

            server_proxy_instance_mock.supervisor.getProcessInfo.return_value = {"name": "etl0/0"}

            resposnse = self.client.post(reverse("server-processes-detail", args=(self.s.id, "etl0-0")), data=json.dumps(payload),
                                        content_type='application/json',
                                        HTTP_AUTHORIZATION="Token {}".format(self.token.key))
            self.assertEqual(202, resposnse.status_code)


            self.assertEqual([mock.call("http://sieve:pwd@127.0.0.1:9000/RPC2")], serverProxy_mock.call_args_list)
            self.assertEqual([mock.call("crawler:etl0/0", True)], server_proxy_instance_mock.supervisor.startProcess.call_args_list)
            self.assertEqual([mock.call("crawler:etl0/0")], server_proxy_instance_mock.supervisor.getProcessInfo.call_args_list)

    def test_check_calling_right_action_stop(self):
        """
        Actions: "start", "stop", "restart"
        :return:
        """

        payload = {
            "action": "stop",
            "group": "crawler",

        }
        server_proxy_instance_mock = mock.Mock()
        with mock.patch.object(api.views, "ServerProxy", return_value=server_proxy_instance_mock) as serverProxy_mock:
            server_proxy_instance_mock.supervisor.getProcessInfo.return_value = {"name": "etl0/0"}
            resposnse = self.client.post(reverse("server-processes-detail", args=(self.s.id, "etl0-0")), data=json.dumps(payload),
                                        content_type='application/json',
                                        HTTP_AUTHORIZATION="Token {}".format(self.token.key))
            self.assertEqual(202, resposnse.status_code)

            self.assertEqual([mock.call("http://sieve:pwd@127.0.0.1:9000/RPC2")], serverProxy_mock.call_args_list)
            self.assertEqual([mock.call("crawler:etl0/0", True)], server_proxy_instance_mock.supervisor.stopProcess.call_args_list)

    def test_check_calling_right_action_restart(self):
        """
        Actions: "start", "stop", "restart"
        :return:
        """

        payload = {
            "action": "restart",
            "group": "crawler",

        }

        server_proxy_instance_mock = mock.Mock()
        with mock.patch.object(api.views, "ServerProxy", return_value=server_proxy_instance_mock) as serverProxy_mock:
            server_proxy_instance_mock.supervisor.getProcessInfo.return_value = {"name": "etl0/0"}
            resposnse = self.client.post(reverse("server-processes-detail", args=(self.s.id, "etl0-0")), data=json.dumps(payload),
                                        content_type='application/json',
                                        HTTP_AUTHORIZATION="Token {}".format(self.token.key))
            self.assertEqual(202, resposnse.status_code)

            self.assertEqual([mock.call("http://sieve:pwd@127.0.0.1:9000/RPC2")], serverProxy_mock.call_args_list)
            self.assertEqual([mock.call("crawler:etl0/0", True)], server_proxy_instance_mock.supervisor.stopProcess.call_args_list)
            self.assertEqual([mock.call("crawler:etl0/0", True)], server_proxy_instance_mock.supervisor.startProcess.call_args_list)

    def test_check_unknown_command(self):
        """
        :return:
        """

        payload = {
            "action": "what",
            "group": "crawler",

        }

        server_proxy_instance_mock = mock.Mock()
        with mock.patch.object(api.views, "ServerProxy", return_value=server_proxy_instance_mock) as serverProxy_mock:
            server_proxy_instance_mock.supervisor.getProcessInfo.return_value = {"name": "etl0/0"}
            resposnse = self.client.post(reverse("server-processes-detail", args=(self.s.id, "etl0-0")), data=json.dumps(payload),
                                        content_type='application/json',
                                        HTTP_AUTHORIZATION="Token {}".format(self.token.key))
            self.assertEqual(400, resposnse.status_code)

    def test_get_full_process_name_without_group(self):
        request_data = {
            "action": "start"
        }

        ps = api.views.ServerProcessView()
        self.assertEqual("etl0/0", api.views._get_full_process_name(request_data, "etl0-0"))