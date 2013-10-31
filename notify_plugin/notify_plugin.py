#!/usr/bin/env python
"""
Notify any PROCESS_STATE changes in realtime
to the dashboard server
"""
import os
import sys

import requests

from supervisor import childutils


def main():
    if not "SUPERVISOR_ENABLED" in os.environ:
        sys.stderr.write("notify_plugin must be run as a supervisor event listener\n")
        sys.stderr.flush()
        return

    while 1:
        headers, payload = childutils.listener.wait(sys.stdin, sys.stdout)
        sys.stderr.write("{}\n\n".format(headers))
        sys.stderr.write("{}\n\n".format(payload))
        #TODO: Send a POST to the Dashboard URL
        # requests.post(DASHBOARD_URL, data={"key": "value"}
        childutils.listener.ok(sys.stdout)


if __name__ == "__main__":
    main()