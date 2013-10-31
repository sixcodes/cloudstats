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

    if len(sys.argv) < 2:
        sys.stderr.write("notify_plugin must receive the Dashboard URL")
        sys.stderr.flush()
        sys.exit(1)

    dashboard_url = sys.argv[1]

    while 1:
        headers, payload = childutils.listener.wait(sys.stdin, sys.stdout)
        pheaders, pdata = childutils.eventdata(payload+'\n')
        pheaders["hostname"] = socket.gethostname()  # Send hostname
        pheaders["to_state"] = headers["eventname"].replace("PROCESS_STATE_", "")  # Send current state
        if not "notify_plugin" in pheaders["processname"]:
            requests.post(dashboard_url, data=pheaders)

        childutils.listener.ok(sys.stdout)


if __name__ == "__main__":
    main()