import sqlite3
from contextlib import closing

DB_PATH = 'properties.db'

# Initialize the database (run once at startup)
def init_db():
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS properties (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    type TEXT NOT NULL,
                    location TEXT NOT NULL,
                    price INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    images TEXT NOT NULL -- JSON string of image URLs/base64
                )
            ''')

def get_all_properties():
    with closing(sqlite3.connect(DB_PATH)) as conn:
        cur = conn.execute('SELECT * FROM properties ORDER BY id DESC')
        rows = cur.fetchall()
        return [row_to_dict(row) for row in rows]

def add_property(data):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            cur = conn.execute('''
                INSERT INTO properties (title, type, location, price, description, images)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                data['title'], data['type'], data['location'], data['price'], data['description'], data['images']
            ))
            return cur.lastrowid

def update_property(prop_id, data):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute('''
                UPDATE properties SET title=?, type=?, location=?, price=?, description=?, images=? WHERE id=?
            ''', (
                data['title'], data['type'], data['location'], data['price'], data['description'], data['images'], prop_id
            ))

def delete_property(prop_id):
    with closing(sqlite3.connect(DB_PATH)) as conn:
        with conn:
            conn.execute('DELETE FROM properties WHERE id=?', (prop_id,))

def row_to_dict(row):
    return {
        'id': row[0],
        'title': row[1],
        'type': row[2],
        'location': row[3],
        'price': row[4],
        'description': row[5],
        'images': row[6],
    } 