from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op

def db_online_info(db_server, operation, id ='', status =''):
    # Validate the database.
    try:
        db = db_server['online_info']
    except ResourceNotFound:
        print('There is no database named online_info!')
        return 405
    # Validate the data.
    try:
        assert type(status) == str
    except AssertionError:
        print('The online status should be in str form!')
        return 408

    # Update status.
    if operation.lower() == 'update':
        try:
            doc = db[id]
            db.purge([doc])
            db.compact()
        except ResourceNotFound:
            pass
        new_content = {'_id': id, 'status': status}
        db.save(new_content)
        return 200

    # Get status.
    elif operation.lower() == 'get':
        if type(id) != list:
            id = [id]
        list_info = {}
        for i in range(len(id)):
            try:
                doc = dict(db[id[i]])
                list_info[doc['_id']] = doc['status']
            except ResourceNotFound:
                print('There is no such a file!')
        return 200, list_info

    # Update status.
    elif operation.lower() == 'delete':
        resp = db_op.db_operate(db_server, 'online_info', 'delete', id = id)
        return resp

# Flask for accounts.
online_info_handler = Blueprint('online_info', __name__)
db_server = db_op.get_server()
@online_info_handler .route('', methods=['DELETE', 'PUT', 'GET'])
def resp_online_info():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    if request.method == 'DELETE':
        id = data['_id']
        resp = db_online_info(db_server, 'delete', id = id,)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        id = data['_id']
        status = data['status']
        resp = db_online_info(db_server, 'update', id = id, status = status)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = data['_id']
        resp, status_list = db_online_info(db_server, 'get', id = id )
        response['resp'] = resp
        response['status_list'] = status_list
        return response