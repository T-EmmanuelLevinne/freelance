from flask import Flask, request, jsonify, send_from_directory
import os
import bcrypt
import socket
from config import PREFERRED_PORT, FALLBACK_PORTS, HOST, DEBUG, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
import sys

app = Flask(__name__)

# Use the configuration from config.py
# ADMIN_USERNAME and ADMIN_PASSWORD_HASH are now imported from config.py

# Serve static files from the parent directory (project root)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(PROJECT_ROOT, filename)

@app.route('/')
def serve_index():
    return send_from_directory(PROJECT_ROOT, 'index.html')

@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    print("Received:", username, password)  # Debugging line
    if username == ADMIN_USERNAME and bcrypt.checkpw(password.encode('utf-8'), ADMIN_PASSWORD_HASH):
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route('/api/admin-login', methods=['GET'])
def admin_login_get():
    return jsonify({"message": "This endpoint only accepts POST requests for admin login."}), 200

def find_available_port(start_port):
    """Find an available port starting from the preferred port"""
    for port in [start_port] + FALLBACK_PORTS:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind((HOST, port))
                return port
        except OSError:
            continue
    return None

if __name__ == '__main__':
    # For Render deployment, use environment variables for port
    port = int(os.environ.get('PORT', PREFERRED_PORT))
    
    if os.environ.get('RENDER'):  # Running on Render
        print(f"🚀 Starting server on Render with port {port}")
        app.run(debug=False, host='0.0.0.0', port=port)
    else:  # Local development
        port = find_available_port(PREFERRED_PORT)
        if port is None:
            print(f"❌ ERROR: Port {PREFERRED_PORT} is not available!")
            print(f"Please make sure port {PREFERRED_PORT} is free and try again.")
            print("You can:")
            print(f"1. Stop any application using port {PREFERRED_PORT}")
            print(f"2. Check what's using port {PREFERRED_PORT} with: netstat -ano | findstr :{PREFERRED_PORT}")
            sys.exit(1)
        else:
            print(f"✅ Starting server on port {port}")
            app.run(debug=DEBUG, host=HOST, port=port) 