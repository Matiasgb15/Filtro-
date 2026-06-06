#!/usr/bin/env python3
"""
Servidor HTTP simple para ejecutar el juego PONG Roland-Garros
Ejecutar: python3 server.py
Luego abre: http://localhost:8000
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIRECTORY), **kwargs)

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"""
╔════════════════════════════════════════════════════════╗
║        🎾 PONG ROLAND-GARROS - SERVIDOR ACTIVO         ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Abre tu navegador en:                                 ║
║  👉 http://localhost:{PORT}                           ║
║                                                        ║
║  Presiona CTRL+C para detener                         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
        """)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Servidor detenido.")
