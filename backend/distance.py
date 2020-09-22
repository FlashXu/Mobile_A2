from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op
from friends_list import db_friends_list

# Handle database
def db_distance(db_server, operation, id = [], data = {}):
    import datetime
    from datetime import timedelta
    db = db_server['distance']
    # Create distance record.
    if operation.lower() == 'create':
        try:
            new_data = {}
            new_data['_id'] = data['_id']
            record_time = datetime.datetime.strptime(data['start_time'], "%Y-%m-%d %H:%M:%S")
            new_data['this_week'] = (record_time - timedelta(days=record_time.weekday())).strftime("%Y-%m-%d")
            new_data['week_distance'] = data['distance']
            new_data['this_month'] = datetime.datetime(record_time.year, record_time.month, 1).strftime("%Y-%m-%d")
            new_data['month_distance'] = data['distance']
            new_data['this_year'] = datetime.datetime(record_time.year, 1, 1).strftime("%Y-%m-%d")
            new_data['year_distance'] = data['distance']
            new_data['total_distance'] = data['distance']
            new_data['record_time'] = data['start_time']
            db.save(new_data)
            return 200
        except ResourceConflict:
            print("Info already existed!")
            return 406

    # Update distance record.
    elif operation.lower() == 'update':
        id = data['_id']
        try:
            doc = db[id]
            current_record = dict(doc)

            # Check data uniqueness.
            if(current_record['record_time'] == data['start_time']):
                print('Duplicate data!')
                return 406

            del current_record['_rev']
            current_record['total_distance'] += data['distance']
            current_record['record_time'] = data['start_time']

            db_week = current_record['this_week']
            db_month = current_record['this_month']
            db_year = current_record['this_year']

            record_time = datetime.datetime.strptime(data['start_time'], "%Y-%m-%d %H:%M:%S")
            record_week = (record_time - timedelta(days=record_time.weekday())).strftime("%Y-%m-%d")
            record_month = datetime.datetime(record_time.year, record_time.month, 1).strftime("%Y-%m-%d")
            record_year = datetime.datetime(record_time.year, 1, 1).strftime("%Y-%m-%d")

            if db_week != record_week:
                current_record['week_distance'] = data['distance']
                current_record['this_week'] = record_week
            else:
                current_record['week_distance'] += data['distance']

            if db_month != record_month:
                current_record['month_distance'] = data['distance']
                current_record['this_month'] = record_month
            else:
                current_record['month_distance'] += data['distance']

            if db_year != record_year:
                current_record['year_distance'] = data['distance']
                current_record['this_year'] = record_year
            else:
                current_record['year_distance'] += data['distance']

            db.purge([doc])
            db.compact()
            db.save(current_record)

        except ResourceNotFound:
            db_distance(db_server, 'create', data = data)
        return 200

    # Get distance record.
    elif operation.lower() == 'get':
        if type(id) != list:
            id = [id]
        record_detail = []
        for i in range(len(id)):
            current_id = id[i]
            try:
                doc = dict(db[current_id])
                del doc['_rev']
                record_detail.append(doc)
            except ResourceNotFound:
                pass
        return 200, record_detail
    # Get weekly ranking.
    elif operation.lower() == 'get_weekly_ranking':
        if type(id) != list:
            id = [id]
        now = datetime.datetime.now()
        this_mon = (now - datetime.timedelta(days=now.weekday())).strftime("%Y-%m-%d")
        record_detail = {}
        for i in range(len(id)):
            current_id = id[i]
            try:
                doc = dict(db[current_id])
                week_distance = doc['week_distance']
                if doc['this_week'] == this_mon:
                    record_detail[current_id] = week_distance
                else:
                    record_detail[current_id] = 0
            except ResourceNotFound:
                    record_detail[current_id] = 0
            except:
                return 404, []
        rank = sorted(record_detail.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
        return 200, rank

    # Delete distance record.
    elif operation.lower() == 'delete':
        resp = db_op.db_operate(db_server, 'distance', operation, id = id)
        return resp

# Flask for distance.
distance_handler = Blueprint('distance', __name__)
db_server = db_op.get_server()
@distance_handler.route('', methods=['POST', 'DELETE', 'PUT', 'GET'])
def resp_distance ():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))

    if request.method == 'POST':
        resp = db_distance(db_server, 'create', data = data)
        response['resp'] = resp
        return response
    elif request.method == 'DELETE':
        id = data['_id']
        resp = db_distance(db_server, 'delete', id = id)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        resp = db_distance(db_server, 'update', data = data)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = data['_id']
        resp, record_detail = db_distance(db_server, 'get', id = id)
        response['resp'] = resp
        response['record_detail'] = record_detail
        return response

# Get weekly ranking for one user.
@distance_handler.route('/weekly_ranking', methods=['GET'])
def resp_weekly_ranking ():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    id = data['_id']
    _, friends_list = db_friends_list(db_server, 'get', id = id)
    friends_list.append(id)
    # Make sure uniqueness.
    friends_list = list(set(friends_list))
    resp, rank = db_distance(db_server, 'get_weekly_ranking', id = friends_list)
    response['resp'] = resp
    response['rank'] = rank
    return response
