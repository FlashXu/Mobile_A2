from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op
import distance

def db_running_record(db_server, operation, id = '', query_key=[], data = {}):
    db = db_server['running_record']

    # Insert new running record.
    if operation.lower() == 'create':
        # Check uniqueness of the record.
        cond = [data['user_id'], data['start_time']]
        record_list = db.view('running_info/running_info', start_key = cond, end_key = cond)
        if len(record_list) != 0:
            print("Record is already existed!")
            return 406, ''
        if type(data['distance']) == str:
            data['distance'] = float(data['distance'])
        doc = db.save(data)
        id = data['user_id']
        data['_id'] = id
        distance.db_distance(db_server, 'update', data = data)
        return 200, doc[0]

    # Query running record.
    elif operation.lower() == 'get_by_query':
        record_list = db.view('running_info/running_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return 404, []
        record_detail = []
        for row in record_list:
            doc = db[row.value]
            record_detail.append(dict(doc))
        return 200, record_detail

    # Get running record by id.
    elif operation.lower() == 'get_by_id':
        resp, record_detail = db_op.db_operate(db_server, 'running_record', operation = 'get', id= id)
        return resp, record_detail

    # Delete running record.
    elif operation.lower() == 'delete_by_id':
        resp = db_op.db_operate(db_server, 'running_record', operation = 'delete', id = id)
        return resp

    elif operation.lower() == 'delete_by_query':
        record_list = db.view('running_info/running_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return 404
        for row in record_list:
            try:
                doc = db[row.value]
                db.purge([doc])
                db.compact()
            except ResourceNotFound:
                pass
        return 200

# Flask for accounts.
running_record_handler = Blueprint('running_record', __name__)
db_server = db_op.get_server()
@running_record_handler.route('', methods=['POST', 'DELETE', 'GET'])
def resp_running_record():
    response = {}

    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        resp, gen_id = db_running_record(db_server, 'create', data = data)
        response['resp'] = resp
        response['gen_id'] = gen_id
        return response
    elif request.method == 'DELETE':
        data = eval(str(request.data, encoding="utf-8"))
        id = data['_id']
        resp = db_running_record(db_server, 'delete_by_id', id = id)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = request.args.get('id')
        resp, record_detail = db_running_record(db_server, 'get_by_id', id=id)
        response['resp'] = resp
        response['record_detail'] = record_detail
        return response

@running_record_handler.route('/query', methods=['POST', 'DELETE'])
def resp_running_record_query():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    query_key = data['query_key']
    if request.method == 'POST':
        resp, record_detail = db_running_record(db_server, 'get_by_query', query_key=query_key)
        response['resp'] = resp
        response['record_detail'] = record_detail
        return response
    elif request.method == 'DELETE':
        resp = db_running_record(db_server, 'delete_by_query', query_key = query_key)
        response['resp'] = resp
        return response