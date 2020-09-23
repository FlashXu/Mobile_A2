from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
from db_op import db_operate, get_server

# Flask for personal_info.
personal_info_handler = Blueprint('personal_info', __name__)
db_server = get_server()
@personal_info_handler.route('', methods=['POST', 'DELETE', 'PUT', 'GET'])
def resp_personal_info():
    response = {}
    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        resp = db_operate(db_server, "personal_info", "create", data = data)
        response['resp'] = resp
        return response
    elif request.method == 'DELETE':
        data = eval(str(request.data, encoding="utf-8"))
        id = data['_id']
        resp = db_operate(db_server, "personal_info", "delete", id = id)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        data = eval(str(request.data, encoding="utf-8"))
        resp = db_operate(db_server, "personal_info", "update", data = data)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = request.args.get('id')
        resp, list_info = db_operate(db_server, "personal_info", "get", id = id)
        response['resp'] = resp
        response['list_info'] = list_info
        return response