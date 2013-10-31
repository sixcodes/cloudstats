#!/usr/bin/env python
"""
Notify any PROCESS_STATE changes in realtime
to the dashboard server
"""
import os
import socket
import sys

import requests

from supervisor import childutils


def main():
    if not "SUPERVISOR_ENABLED" in os.environ:
        sys.stderr.write("notify_plugin must be run as a supervisor event listener\n")
        sys.stderr.flush()
        sys.exit(1)

    while 1:

        headers, payload = childutils.listener.wait(sys.stdin, sys.stdout)
        pheaders, pdata = childutils.eventdata(payload+'\n')
        pheaders["hostname"] = socket.gethostname()  # Send hostname
        #TODO: Send a POST to the Dashboard URL
        # requests.post(DASHBOARD_URL, data=pdata)
        childutils.listener.ok(sys.stdout)
        sys.stderr.flush()


if __name__ == "__main__":
    main()