"""Static dev server for the PCA site.

Binds to 127.0.0.1 rather than 0.0.0.0: on Windows the wildcard bind can be
refused by firewall policy with WinError 10013, and a loopback bind is all the
preview pane needs. If the port is already held (a previous run that has not
exited yet), walk forward until a free one is found instead of dying.
"""
import os
import socket
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = os.environ.get("HOST", "127.0.0.1")
START_PORT = int(os.environ.get("PORT", "4321"))
MAX_TRIES = 20


class Handler(SimpleHTTPRequestHandler):
    """No-cache, so an edited file is always the one the browser gets."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # keep failures visible, drop the per-request noise
        if args and str(args[1] if len(args) > 1 else "").startswith(("4", "5")):
            super().log_message(fmt, *args)


ThreadingHTTPServer.allow_reuse_address = True
ThreadingHTTPServer.daemon_threads = True

httpd = None
for offset in range(MAX_TRIES):
    port = START_PORT + offset
    try:
        httpd = ThreadingHTTPServer((HOST, port), Handler)
        break
    except OSError as exc:
        print("port %d unavailable (%s), trying %d" % (port, exc, port + 1), flush=True)

if httpd is None:
    print("no free port in %d-%d" % (START_PORT, START_PORT + MAX_TRIES - 1), file=sys.stderr)
    raise SystemExit(1)

print("Serving HTTP on %s port %d" % (HOST, httpd.server_address[1]), flush=True)
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    httpd.server_close()
