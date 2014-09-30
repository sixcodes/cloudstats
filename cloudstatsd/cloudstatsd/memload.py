# coding=utf-8
import os
import time
import multiprocessing
import json
import socket

import psutil
import requests


cpu_count = multiprocessing.cpu_count()
auth_token = os.environ.get("CLOUDSTATS_AUTH_TOKEN")
base_headers = {"Authorization": "Token {}".format(auth_token), "Content-type": "application/json"}
api_baseurl = os.environ.get("CLOUDSTATS_API_BASE_URL")


def get_uptime():
    try:
        with open('/proc/uptime', 'r') as f:
            return float(f.readline().split()[0])
    except:
        return None


def _make_request(resoruce, data):
    return requests.post(api_baseurl + "/" + resoruce, data=json.dumps(data), headers=base_headers)


def main():

    # registra-se no cloudstats
    server_register = {
        "name": socket.gethostname(),
    }
    resp = _make_request("servers", server_register)
    print "registering server: {}, status_code={}".format(server_register, resp.status_code)
    print resp.content

    while True:
        time.sleep(5)
        data = {
            "load": (os.getloadavg()[0] / cpu_count) * 100,
            "mem": psutil.virtual_memory().percent,
            "swap": psutil.swap_memory().percent,
            "uptime": get_uptime()
        }

        try:
            response = _make_request("stats", data)
            print response.status_code, response.content
        except:
            pass


if __name__ == "__main__":
    main()
