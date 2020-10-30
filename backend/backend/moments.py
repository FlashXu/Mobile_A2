from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op
from friends_list import db_friends_list


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
        data['like_num'] = 0
        data['like_list'] = []
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

    elif operation.lower() == 'friends_moments':
        import datetime
        personal_info_db = db_server['personal_info']
        if type(id) != list:
            id = [id]
        moment_list = []
        for id_item in id:
            record_list = db.view('moments_info/moments_info', start_key=[id_item], end_key=[id_item + 'CHANGE'])
            if len(record_list) == 0:
                continue
            else:
                for row in record_list:
                    moment_id = row.value
                    try:
                        doc = dict(db[moment_id])
                        # Get user_name
                        user_id = doc['user_id']
                        try:
                            doc1 = dict(personal_info_db[user_id])
                            doc['first_name'] = doc1['first_name']
                            doc['last_name'] = doc1['last_name']
                        except ResourceConflict:
                            doc['first_name'] = ''
                            doc['last_name'] = ''
                        # Get comment user name
                        if len(doc['comments']) > 0:
                            for i in range(len(doc['comments'])):
                                user_id = doc['comments'][i]['user_id']
                                try:
                                    doc1 = dict(personal_info_db[user_id])
                                    doc['comments'][i]['first_name'] = doc1['first_name']
                                    doc['comments'][i]['last_name'] = doc1['last_name']
                                except ResourceConflict:
                                    doc['comments'][i]['first_name'] = ''
                                    doc['comments'][i]['last_name'] = ''
                        moment_list.append(doc)
                    except ResourceConflict:
                        continue
        sorted_moments = sorted(moment_list, key=lambda kv: datetime.datetime.strptime(kv['time'], "%Y-%m-%d %H:%M:%S"), reverse=True)
        return 200, sorted_moments

    elif operation.lower() == 'like':
        try:
            doc = dict(db[id])
            new_data = doc.copy()
            del new_data['_rev']
            like_list = new_data['like_list']
            if data['user_id'] in like_list:
                return 406
            else:
                new_data['like_num'] += 1
                new_data['like_list'].append(data['user_id'])
                db.purge([doc])
                db.compact()
                db.save(new_data)
                return 200
        except ResourceConflict:
            return 404

    elif operation.lower() == 'dislike':
        try:
            doc = dict(db[id])
            new_data = doc.copy()
            del new_data['_rev']
            like_list = new_data['like_list']
            if data['user_id'] in like_list:
                new_data['like_num'] -= 1
                new_data['like_list'].remove(data['user_id'])
                db.purge([doc])
                db.compact()
                db.save(new_data)
                return 200
            else:
                return 404
        except ResourceConflict:
            return 404

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

@moments_handler.route('/like', methods=['POST'])
def resp_like():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    id = data['_id']
    if data['type'] == 'like':
        resp = db_moments(db_server, 'like', id=id,  data=data)
    else:
        resp = db_moments(db_server, 'dislike', id=id, data=data)
    response['resp'] = resp
    return response

@moments_handler.route('/friends_moments', methods=['GET'])
def resp_friends_moments():
    response = {}
    id = request.args.get('id')
    _, friends_list = db_friends_list(db_server, 'get', id=id)
    friends_list.append(id)
    # Make sure uniqueness.
    friends_list = list(set(friends_list))
    resp, moment_list = db_moments(db_server, 'friends_moments', id=friends_list )
    response['resp'] = resp
    response['moments_list'] = moment_list
    return response
