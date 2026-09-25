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

    class QuietHandler(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=args.dir, **kw)
        def end_headers(self):
            # Allow CORS and caching for 3D assets
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "public, max-age=3600")
            super().end_headers()

    with socketserver.TCPServer(("", args.port), QuietHandler) as httpd:
        print(f"Sakura River Valley server running at http://localhost:{args.port}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    main()
