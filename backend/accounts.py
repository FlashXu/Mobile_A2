from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op

# Handle database
def db_accounts(db_server, operation, id = '', data = {}):
    if operation.lower() == 'create':
        # Check unique user_name
        db = db_server['accounts']
        user_name = data['user_name']
        record_list = db.view('auth/auth', start_key = [user_name], end_key = [user_name + 'CHANGE'])
        if len(record_list) != 0:
            return 406, ''
        resp, gen_id= db_op.db_operate(db_server, 'accounts', operation, data = data)
        return resp, gen_id

    elif operation.lower() == 'get':
        if id == '':
            return 404, []
        resp, account_info = db_op.db_operate(db_server, 'accounts', operation, id = id)
        return resp, account_info

    elif operation.lower() == 'auth':
        db = db_server['accounts']
        query_key = [data['user_name'], data['pwd']]
        record_list = db.view('auth/auth', start_key=query_key, end_key = query_key)
        if len(record_list) == 0:
            print('User_name of password wrong!')
            return 404, ''
        id_list = []
        for row in record_list:
            id_list.append(row.value)
        return 200, id_list[0]

    # Change password.
    elif operation.lower() == 'update':
        db = db_server['accounts']
        try:
            doc = db[data['_id']]
            resp = db_op.db_operate(db_server, 'accounts', operation, data=data)
        except ResourceNotFound:
            resp = 404
        return resp

    elif operation.lower() == 'delete':
        if id == '':
            return 404
        resp = db_op.db_operate(db_server, 'accounts', operation, id = id)
        return resp

# Flask for accounts.
accounts_handler = Blueprint('accounts', __name__)
db_server = db_op.get_server()
@accounts_handler.route('', methods=['POST', 'DELETE', 'PUT', 'GET'])
def resp_account():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    if request.method == 'POST':
        resp, gen_id = db_accounts(db_server, 'create', data = data)
        response['resp'] = resp
        response['gen_id'] = gen_id
        return response
    elif request.method == 'DELETE':
        id = data['_id']
        resp = db_accounts(db_server, 'delete', id = id)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        resp = db_accounts(db_server, 'update', data = data)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        if 'auth' in data.keys():
            resp, gen_id = db_accounts(db_server, 'auth', data = data)
            response['resp'] = resp
            response['gen_id'] = gen_id
            return response
        else:
            id = data['_id']
            resp, account_info = db_accounts(db_server, 'get', id = id)
            response['resp'] = resp
            response['account_info'] = account_info
            return response


