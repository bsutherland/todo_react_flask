import time
from flask import Flask, g, jsonify, request
import sqlite3

app = Flask(__name__)

DATABASE = 'todo.sqlite3'

def query_db(query, args=()):
    cur = get_db().execute(query, args)
    rows = cur.fetchall()
    cur.close()
    return rows

@app.route('/time')
def get_current_time():
    return {'time': time.time()}


def get_db():
    db = getattr(g, '_database', None)
    if not db:
        db = g._database = sqlite3.connect(DATABASE, autocommit=True)
    db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exc):
    db = getattr(g, '_database', None)
    if db:
        db.close()


@app.get('/todo')
def get_todos():
    todos = query_db('SELECT id, text, done FROM todo ORDER BY id')
    return [dict(row) for row in todos]


@app.post('/todo')
def add_todo():
    text = request.json['text']
    query_db('INSERT INTO todo(text) VALUES (?)', (text,))
    return '', 201


@app.put('/todo/<id>')
def toggle_done(id):
    query_db('UPDATE todo SET done=((done | 1) - (done & 1)) WHERE id=?', (id,))
    return '', 204,