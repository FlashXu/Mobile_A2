from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op

def db_moments(db_server, operation, id = '', query_key=[], data = {}):
    db = db_server['moments']
    # Insert new moments
    if operation.lower() == 'create':
        # Check uniqueness of the record.
        cond = [data['user_id'], data['time']]
        record_list = db.view('moments_info/moments_info', start_key = cond, end_key = cond)
        if len(record_list) != 0:
            print("Moment is already existed!")
            return 406, ''
        doc = db.save(data)
        return 200, doc[0]

    # Make comments.
    elif operation.lower() == 'comment':
        id = data["_id"]
        try:
            doc = db[id]
            new_content = dict(doc)
            del data['_id']
            new_content['comments'].append(data)
            del new_content['_rev']
            db.purge([doc])
            db.compact()
            db.save(new_content)
            return 200
        except ResourceNotFound:
            print("There is no such a moment.")
            return 404

    # Query moments.
    elif operation.lower() == 'get_by_query':
        record_list = db.view('moments_info/moments_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return 404, []
        record_detail = []
        for row in record_list:
            doc = db[row.value]
            record_detail.append(dict(doc))
        print(record_detail)
        return 200, record_detail

    # Get moments by id.
    elif operation.lower() == 'get_by_id':
        resp, record_detail = db_op.db_operate(db_server, 'moments', operation='get', id = id)
        return resp, record_detail

    # Delete moments.
    elif operation.lower() == 'delete_by_id':
        resp = db_op.db_operate(db_server, 'moments', operation = 'delete', id=id)
        return resp

    elif operation.lower() == 'delete_by_query':
        record_list = db.view('moments_info/moments_info', start_key =query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return 404
        for row in record_list:
            doc = db[row.value]
            db.purge([doc])
            db.compact()
        return 200

# Flask for accounts.
moments_handler = Blueprint('moments', __name__)
db_server = db_op.get_server()
@moments_handler.route('', methods=['POST', 'DELETE', 'GET'])
def resp_moments():
    response = {}

    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        resp, gen_id = db_moments(db_server, 'create', data = data)
        response['resp'] = resp
        response['gen_id'] = gen_id
        return response
    elif request.method == 'DELETE':
        data = eval(str(request.data, encoding="utf-8"))
        id = data['_id']
        resp = db_moments(db_server, 'delete_by_id', id = id)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = request.args.get('id')
        resp, record_detail = db_moments(db_server, 'get_by_id', id=id)
        response['resp'] = resp
        response['record_detail'] = record_detail
        return response

@moments_handler.route('/comment', methods=['POST'])
def resp_moments_comment():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    resp = db_moments(db_server, 'comment', data=data)
    response['resp'] = resp
    return response

@moments_handler.route('/query', methods=['POST', 'DELETE'])
def resp_moments_query():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    query_key = data['query_key']
    if request.method == 'POST':
        resp, record_detail = db_moments(db_server, 'get_by_query', query_key=query_key)
        response['resp'] = resp
        response['record_detail'] = record_detail
        return response
    elif request.method == 'DELETE':
        resp = db_moments(db_server, 'delete_by_query', query_key=query_key)
        response['resp'] = resp
        return response


