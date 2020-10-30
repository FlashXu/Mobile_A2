import couchdb
from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op

def db_friends_list(db_server, operation, id = '', data = {}):
    # Validate the database.
    try:
        db = db_server['friends_list']
    except ResourceNotFound:
        print('There is no database named friends_list!')
        return 405

    # Add friends.
    if operation.lower() == 'add':
        try:
            current_id = data['_id']
            doc = db[current_id]
            f_list = dict(doc)['friends']
            f_list.extend(data['friends'])
            f_list = list(set(f_list))
            new_content = {'_id': current_id,  'friends': f_list}
            db.purge([doc])
            db.compact()
            db.save(new_content)
        except ResourceNotFound:
            if 'operation' in data.keys():
                del data['operation']
            db.save(data)
        except:
            return 404
        return 200

    # Delete some friends.
    elif operation.lower() == 'delete':
        try:
            current_id = data['_id']
            doc = db[current_id]
            f_list = dict(doc)['friends']
            friends_its = set(f_list).intersection(set(data['friends']))
            f_list = list(set(f_list)^friends_its)
            new_content = {'_id': current_id,  'friends': f_list}
            db.purge([doc])
            db.compact()
            db.save(new_content)
        except ResourceNotFound:
            pass
        except:
            return 404
        return 200

    # Delete the whole record
    elif operation.lower() == 'delete_all':
        try:
            doc = db[id]
            db.purge([doc])
            db.compact()
        except ResourceNotFound:
            pass
        except:
            return 404
        return 200

    # Get friends list.
    elif operation.lower() == 'get':
        try:
            doc = db[id]
            f_list = dict(doc)['friends']
            return 200, f_list
        except ResourceNotFound:
            print('There is no record!')
            return 404, []

# Flask for friends_list
friends_list_handler = Blueprint('friends_list', __name__)
db_server = db_op.get_server()
@friends_list_handler.route('', methods=['POST', 'DELETE', 'PUT', 'GET'])
def resp_friends_list():
    response = {}

    # Create new friends list.
    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        resp = db_friends_list(db_server, 'add', data=data)
        response['resp'] = resp
        return response
    elif request.method == 'DELETE':
        data = eval(str(request.data, encoding="utf-8"))
        id = data['_id']
        resp = db_friends_list(db_server, 'delete_all', id=id)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        data = eval(str(request.data, encoding="utf-8"))
        operation = data['operation']
        if operation == "add":
            resp = db_friends_list(db_server, 'add', data=data)
        else:
            resp = db_friends_list(db_server, 'delete', data=data)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = request.args.get('id')
        resp, f_list = db_friends_list(db_server, 'get', id=id)
        response['resp'] = resp
        response['friends_list'] = f_list
        return response