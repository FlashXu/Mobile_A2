from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op
from friends_list import db_friends_list
import datetime

# Handle database
def db_distance(db_server, operation, id = [], data = {}, ranking_type = 'daily'):
    from datetime import timedelta
    db = db_server['distance']
    # Create distance record.
    if operation.lower() == 'create':
        try:
            if type(data['distance']) == str:
                data['distance'] = float(data['distance'])
            new_data = {}
            new_data['_id'] = data['_id']
            record_time = datetime.datetime.strptime(data['start_time'], "%Y-%m-%d %H:%M:%S")
            new_data['this_day'] = record_time.date().strftime("%Y-%m-%d")
            new_data['daily_distance'] = data['distance']
            new_data['this_week'] = (record_time - timedelta(days=record_time.weekday())).strftime("%Y-%m-%d")
            new_data['week_distance'] = data['distance']
            new_data['this_month'] = datetime.datetime(record_time.year, record_time.month, 1).strftime("%Y-%m-%d")
            new_data['month_distance'] = data['distance']
            new_data['this_year'] = datetime.datetime(record_time.year, 1, 1).strftime("%Y-%m-%d")
            new_data['year_distance'] = data['distance']
            new_data['total_distance'] = data['distance']
            new_data['record_time'] = data['start_time']
            new_data['total_sessions'] = 1
            if data['status'] == 'completed':
                new_data['completed_sessions'] = 1
            else:
                new_data['completed_sessions'] = 0
            print(new_data)
            db.save(new_data)
            return 200
        except ResourceConflict:
            print("Info already existed!")
            return 406

    # Update distance record.
    elif operation.lower() == 'update':
        id = data['_id']
        try:
            if type(data['distance']) == str:
                data['distance'] = float(data['distance'])
            doc = db[id]
            current_record = dict(doc)

            # Check data uniqueness.
            if(current_record['record_time'] == data['start_time']):
                print('Duplicate data!')
                return 406

            del current_record['_rev']
            db_record_time =  datetime.datetime.strptime(current_record['record_time'], "%Y-%m-%d %H:%M:%S")
            record_time = datetime.datetime.strptime(data['start_time'], "%Y-%m-%d %H:%M:%S")
            current_record['total_distance'] += data['distance']
            current_record['total_sessions'] += 1
            if data['status'] == 'completed':
                current_record['completed_sessions'] += 1

            db_day = current_record['this_day']
            db_week = current_record['this_week']
            db_month = current_record['this_month']
            db_year = current_record['this_year']
            record_day = record_time.date().strftime("%Y-%m-%d")
            record_week = (record_time - timedelta(days=record_time.weekday())).strftime("%Y-%m-%d")
            record_month = datetime.datetime(record_time.year, record_time.month, 1).strftime("%Y-%m-%d")
            record_year = datetime.datetime(record_time.year, 1, 1).strftime("%Y-%m-%d")

            # New data
            if record_time > db_record_time:
                current_record['record_time'] = data['start_time']
                if db_day != record_day:
                    current_record['daily_distance'] = data['distance']
                    current_record['this_day'] = record_day
                else:
                    current_record['daily_distance'] += data['distance']
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
            # Old data.
            else:
                if db_day == record_day:
                    current_record['daily_distance'] += data['distance']
                if db_week == record_week:
                    current_record['week_distance'] += data['distance']
                if db_month == record_month:
                    current_record['month_distance'] += data['distance']
                if db_year == record_year:
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
    # Get ranking.
    elif operation.lower() == 'get_ranking':
        personal_info_db = db_server['personal_info']
        if type(id) != list:
            id = [id]
        now = datetime.datetime.now()
        if ranking_type == 'daily':
            this_item = now.date().strftime("%Y-%m-%d")
            record_keyword = 'daily_distance'
            date_keyword = 'this_day'
            distance_keyword = 'daily_distance'
        elif ranking_type == 'weekly':
            this_item = (now - timedelta(days=now.weekday())).strftime("%Y-%m-%d")
            date_keyword = 'this_week'
            distance_keyword  = 'week_distance'
        elif ranking_type == 'monthly':
            this_item = datetime.datetime(now.year, now.month, 1).strftime("%Y-%m-%d")
            date_keyword = 'this_month'
            distance_keyword  = 'month_distance'
        elif ranking_type == 'yearly':
            this_item = datetime.datetime(now.year, 1, 1).strftime("%Y-%m-%d")
            date_keyword = 'this_year'
            distance_keyword  = 'year_distance'
        record_detail = {}
        for i in range(len(id)):
            current_id = id[i]
            info_list = {}
            try:
                doc = dict(db[current_id])
                distance = doc[distance_keyword]
                if doc[date_keyword] == this_item:
                    info_list['distance'] = distance
                else:
                    info_list['distance'] = 0
            except ResourceNotFound:
                info_list['distance'] = 0
            # Add user's name into it.
            try:
                doc1 = dict(personal_info_db[current_id])
                info_list['first_name'] = doc1['first_name']
                info_list['last_name'] = doc1['last_name']
            except ResourceNotFound:
                info_list['first_name'] = ''
                info_list['last_name'] = ''
            except:
                return 404, []
            record_detail[current_id] = info_list
        rank = sorted(record_detail.items(), key=lambda kv: (kv[1]['distance'], kv[0]), reverse=True)
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

    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        resp = db_distance(db_server, 'create', data = data)
        response['resp'] = resp
        return response
    elif request.method == 'DELETE':
        data = eval(str(request.data, encoding="utf-8"))
        id = data['_id']
        resp = db_distance(db_server, 'delete', id = id)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        data = eval(str(request.data, encoding="utf-8"))
        resp = db_distance(db_server, 'update', data = data)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = request.args.get('id')
        resp, record_detail = db_distance(db_server, 'get', id = id)
        response['resp'] = resp
        response['record_detail'] = record_detail
        return response

# Get weekly ranking for one user.
@distance_handler.route('/ranking/<type>', methods=['GET'])
def resp_ranking (type):
    response = {}
    id = request.args.get('id')
    _, friends_list = db_friends_list(db_server, 'get', id = id)
    friends_list.append(id)
    # Make sure uniqueness.
    friends_list = list(set(friends_list))
    resp, rank = db_distance(db_server, 'get_ranking', id = friends_list, ranking_type = type)
    response['resp'] = resp
    response['rank'] = rank
    response['type'] = type
    return response
