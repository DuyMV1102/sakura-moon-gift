#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="Serve Sakura River Valley 3D scene")
    parser.add_argument("--port", type=int, default=3000, help="Port to serve on (default: 3000)")
    parser.add_argument("--dir", type=str, default=os.path.dirname(os.path.abspath(__file__)), help="Directory to serve")
    args = parser.parse_args()

    class ThreadedHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=args.dir, **kw)

        def end_headers(self):
            # Allow CORS everywhere
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "*")

            path = self.path.split("?")[0]
            # Assets (.gz, .webp) can be cached; code (.html, .js, .css) MUST NEVER be cached
            if path.endswith((".gz", ".webp", ".png", ".jpg", ".jpeg", ".mp3", ".wav")):
                self.send_header("Cache-Control", "public, max-age=86400")
            else:
                self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
                self.send_header("Pragma", "no-cache")
                self.send_header("Expires", "0")
            super().end_headers()

    # Enable SO_REUSEADDR so port is freed instantly
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", args.port), ThreadedHandler) as httpd:
        print(f"Sakura River Valley threaded server running at http://localhost:{args.port}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    main()
