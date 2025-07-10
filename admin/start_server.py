#!/usr/bin/env python3
"""
Server startup script with specific port requirement
"""
import sys
import os
import socket
from admin_server import app
from config import PREFERRED_PORT, FALLBACK_PORTS, HOST, DEBUG

def check_port_availability(port):
    """Check if the specific port is available"""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind((HOST, port))
            return True
    except OSError:
        return False

def main():
    print("Starting Flask Admin Server...")
    print(f"Required port: {PREFERRED_PORT}")
    print(f"Host: {HOST}")
    print(f"Debug mode: {DEBUG}")
    print("-" * 50)
    
    if check_port_availability(PREFERRED_PORT):
        print(f"✅ Port {PREFERRED_PORT} is available")
        print(f"Starting server on port {PREFERRED_PORT}")
        print(f"Access your application at: http://localhost:{PREFERRED_PORT}")
        app.run(debug=DEBUG, host=HOST, port=PREFERRED_PORT)
    else:
        print(f"❌ ERROR: Port {PREFERRED_PORT} is not available!")
        print(f"Please make sure port {PREFERRED_PORT} is free and try again.")
        print("\nTroubleshooting:")
        print(f"1. Check what's using port {PREFERRED_PORT}:")
        print(f"   netstat -ano | findstr :{PREFERRED_PORT}")
        print(f"2. Kill the process using port {PREFERRED_PORT}:")
        print(f"   taskkill /PID <PID_NUMBER> /F")
        print(f"3. Or restart your computer to clear any stuck processes")
        sys.exit(1)

if __name__ == '__main__':
    main() 