from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
from db_op import db_operate, get_server

# Flask for personal_info.
personal_info_handler = Blueprint('personal_info', __name__)
db_server = get_server()

def get_batch_info(db_server, data):
    id_list = data['_id']
    if type(id_list) != list:
        id_list = [id_list]
    db1 = db_server['personal_info']
    db2 = db_server['online_info']
    db3 = db_server['distance']
    info_list = []
    for id in id_list:
        user_info = {'_id': id}
        try:
            doc1 = dict(db1[id])
            user_info['first_name'] = doc1['first_name']
            user_info['last_name'] = doc1['last_name']
        except ResourceNotFound:
            user_info['first_name'] = ''
            user_info['last_name'] = ''
        try:
            doc2 = dict(db2[id])
            user_info['status'] = doc2['status']
        except ResourceNotFound:
            user_info['status'] = ''
        try:
            doc3 = dict(db3[id])
            user_info['total_distance'] = doc3['total_distance']
            user_info['completed_sessions'] = doc3['completed_sessions']
        except ResourceNotFound:
            user_info['total_distance'] = 0
            user_info['completed_sessions'] = 0
        # Added current ave speed.
        if 'latest_ave_speed' in doc3.keys():
            user_info['ave_speed'] = doc3['latest_ave_speed']
        else:
            user_info['ave_speed'] = 0
        info_list.append(user_info)
    return info_list

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

@personal_info_handler.route('/batch_info', methods=['POST'])
def resp_batch_info():
    response = {}
    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        info_list = get_batch_info(db_server, data)
        response['info_list'] = info_list
        return response
