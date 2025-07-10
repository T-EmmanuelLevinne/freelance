from flask import Flask, request, jsonify, send_from_directory, session
import os
import bcrypt
import json
from config import HOST, DEBUG, ADMIN_USERNAME, ADMIN_PASSWORD_HASH
from db import init_db, get_all_properties, add_property, update_property, delete_property
from functools import wraps

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')

# Initialize the database
init_db()

# Helper: require admin login
def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('is_admin'):
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

# Serve static files from the parent directory (project root)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(PROJECT_ROOT, filename)

@app.route('/')
def serve_index():
    return send_from_directory(PROJECT_ROOT, 'index.html')

# --- Property API ---
@app.route('/api/properties', methods=['GET'])
def api_get_properties():
    props = get_all_properties()
    # images are stored as JSON strings, decode them
    for p in props:
        p['images'] = json.loads(p['images'])
    return jsonify(props)

@app.route('/api/properties', methods=['POST'])
@require_admin
def api_add_property():
    data = request.json
    data['images'] = json.dumps(data.get('images', []))
    prop_id = add_property(data)
    return jsonify({'id': prop_id}), 201

@app.route('/api/properties/<int:prop_id>', methods=['PUT'])
@require_admin
def api_update_property(prop_id):
    data = request.json
    data['images'] = json.dumps(data.get('images', []))
    update_property(prop_id, data)
    return jsonify({'success': True})

@app.route('/api/properties/<int:prop_id>', methods=['DELETE'])
@require_admin
def api_delete_property(prop_id):
    delete_property(prop_id)
    return jsonify({'success': True})

# --- Admin Auth ---
@app.route('/api/admin-login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username == ADMIN_USERNAME and bcrypt.checkpw(password.encode('utf-8'), ADMIN_PASSWORD_HASH):
        session['is_admin'] = True
        return jsonify({"success": True})
    session['is_admin'] = False
    return jsonify({"success": False}), 401

@app.route('/api/admin-logout', methods=['POST'])
def admin_logout():
    session.pop('is_admin', None)
    return jsonify({'success': True})

@app.route('/api/admin-login', methods=['GET'])
def admin_login_get():
    return jsonify({"message": "This endpoint only accepts POST requests for admin login."}), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 61838))
    app.run(debug=DEBUG, host=HOST, port=port) 