import couchdb
from couchdb import ResourceConflict, ResourceNotFound

def get_server(url='35.220.242.6:5984', username='admin', password='mobile'):
    db_path = f'http://{username}:{password}@{url}/'
    print(db_path)
    return couchdb.Server(db_path)

def db_operate(db_server, db_name, operation, id = '', data = {}):
    # Validate the database.
    try:
        db = db_server[db_name]
    except ResourceNotFound:
        print('There is no database named ' + db_name + '!')
        return
    # Validate the data.
    try:
        assert type(data) == dict
    except AssertionError:
        print('The data should be in dict form!')
        return
    # Create new file.
    if operation.lower() == 'create':
        try:
            db.save(data)
        except ResourceConflict:
            print("Info already existed!")
    # Get existed file by id.
    elif operation.lower() == 'get':
        try:
            if type(id) == list:
                list_info = []
                for i in range(len(id)):
                    doc = dict(db[id[i]])
                    list_info.append(doc)
                return list_info
            else:
                doc = db[id]
                return dict(doc)
        except ResourceNotFound:
            print('There is no such a file!')
    # Update existed file.
    elif operation.lower() == 'update':
        try:
            doc = db[id]
            db.purge([doc])
            db.compact()
            db.save(data)
        except ResourceNotFound:
            db.save(data)
    # Delete existed file.
    elif operation.lower() == 'delete':
        if type(id) != list:
            id = [id]
        for i in range(len(id)):
            try:
                doc = db[id[i]]
                db.purge([doc])
                db.compact()
            except ResourceNotFound:
                pass

def db_friendlist(db_server, operation, id = '', data = []):
    # Validate the database.
    try:
        db = db_server['friends_list']
    except ResourceNotFound:
        print('There is no database named friends_list!')
        return
    # Validate the data.
    try:
        assert type(data) == list
    except AssertionError:
        print('The friends should be in list form!')
        return
    # Add friends.
    if operation.lower() == 'add':
        try:
            doc = db[id]
            f_list = dict(doc)['friends']
            f_list = list(set(f_list.extend(data)))
            new_content = {'_id': id,  'friends': f_list}
            db.purge([doc])
            db.compact()
            db.save(new_content)
        except ResourceNotFound:
            new_content = {'_id': id, 'friends': data}
            db.save(new_content)
    # Delete some friends.
    elif operation.lower() == 'delete':
        try:
            doc = db[id]
            f_list = dict(doc)['friends']
            friends_its = set(f_list).intersection(set(data))
            f_list = list(set(f_list)^set(friends_its))
            new_content = {'_id': id,  'friends': f_list}
            db.purge([doc])
            db.compact()
            db.save(new_content)
        except ResourceNotFound:
            pass
    # Delete the whole record
    elif operation.lower() == 'delete_all':
        try:
            doc = db[id]
            db.purge([doc])
            db.compact()
        except ResourceNotFound:
            pass
    # Get friends list.
    elif operation.lower() == 'get':
        try:
            doc = db[id]
            f_list = dict(doc)['friends']
            return f_list
        except ResourceNotFound:
            print('There is no record!')

def db_onlinestatus(db_server, operation, id = '', status = ''):
    # Validate the database.
    try:
        db = db_server['online_info']
    except ResourceNotFound:
        print('There is no database named online_info!')
        return
    # Validate the data.
    try:
        assert type(status) == str
    except AssertionError:
        print('The online status should be in str form!')
        return
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
        return list_info

def db_runningrecord(db_server, operation, id = '', query_key=[], data = {}):
    db = db_server['running_record']
    # Insert new running record.
    if operation.lower() == 'create':
        # Check uniqueness of the record.
        cond = [data['user_id'], data['start_time']]
        record_list = db.view('running_info/running_info', start_key = cond, end_key = cond)
        if len(record_list) != 0:
            print("Record is already existed!")
            return
        db.save(data)
    # Query running record.
    elif operation.lower() == 'get_by_query':
        record_list = db.view('running_info/running_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return
        record_detail = []
        for row in record_list:
            doc = db[row.value]
            record_detail.append(dict(doc))
        return record_detail
    # Get running record by id.
    elif operation.lower() == 'get_by_id':
        record_detail = db_operate(db_server, 'running_record', operation = 'get', id= id)
        return record_detail
    # Delete running record.
    elif operation.lower() == 'delete_by_id':
        db_operate(db_server, 'running_record', operation = 'delete', id = id)
    elif operation.lower() == 'delete_by_query':
        record_list = db.view('running_info/running_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return
        for row in record_list:
            try:
                doc = db[row.value]
                db.purge(doc)
                db.compact()
            except ResourceNotFound:
                pass

def db_moments(db_server, operation, id = '', query_key=[], data = {}):
    db = db_server['moments']
    # Insert new moments
    if operation.lower() == 'create':
        # Check uniqueness of the record.
        cond = [data['user_id'], data['time']]
        record_list = db.view('moments_info/moments_info', start_key = cond, end_key = cond)
        if len(record_list) != 0:
            print("Moment is already existed!")
            return
        db.save(data)
    elif operation.lower() == 'comment':
        assert type(id) == str
        doc = db[id]
        new_content = dict(doc)
        new_content['comment'].append(data)
        del new_content['_id']
        del new_content['_rev']
        db.purge(doc)
        db.compact()
        db.save(new_content)
    # Query moments.
    elif operation.lower() == 'get_by_query':
        record_list = db.view('moments_info/moments_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return
        record_detail = []
        for row in record_list:
            doc = db[row.value]
            record_detail.append(dict(doc))
        return record_detail
    # Get moments by id.
    elif operation.lower() == 'get_by_id':
        record_detail = db_operate(db_server, 'moments', operation='get', id = id)
        return record_detail
    # Delete moments.
    elif operation.lower() == 'delete_by_id':
        db_operate(db_server, 'moments', operation = 'delete', id=id)
    elif operation.lower() == 'delete_by_query':
        record_list = db.view('moments_info/moments_info', start_key=query_key[0], end_key=query_key[1])
        if len(record_list) == 0:
            return
        for row in record_list:
            doc = db[row.value]
            db.purge(doc)
        db.compact()

def db_distance(db_server, operation, id, data = {}):
    import datetime
    from datetime import timedelta
    db = db_server['distance']
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
        except ResourceConflict:
            print("Info already existed!")
    elif operation.lower() == 'update':
        assert type(id) == str
        try:
            doc = db[id]
            current_record = dict(doc)

            # Check data uniqueness.
            if(current_record['record_time'] == data['start_time']):
                print('Duplicate data!')
                return

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

            db.purge(doc)
            db.compact()
            db.save(current_record)

        except ResourceNotFound:
            db_distance(db_server, 'create', id = id, data = data)

    # Get distance record.
    elif operation.lower() == 'get':
        if type(id) != list:
            id = [id]
        record_detail = []
        update_data = {'_id': '', 'start_time':datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'distance': 0}
        for i in range(len(id)):
            current_id = id[i]
            update_data['_id'] = current_id
            try:
                doc = dict(db[current_id])
                db_distance(db_server, 'update', id = current_id, data = update_data)
            except ResourceNotFound:
                db_distance(db_server, 'create', id = current_id, data = update_data)
                doc = dict(db[current_id])
            del doc['_rev']
            record_detail.append(doc)
        return record_detail
    # Delete distance record.
    elif operation.lower() == 'delete':
        db_operate(db_server, 'distance', operation, id = id)

def get_weekly_ranking(db_server, id = ''):
    try:
        friends_list = db_friendlist(db_server, 'get', id = id)
        friends_list.append(id)
        # Make sure uniqueness.
        friends_list = list(set(friends_list))
        distance_record = db_distance(db_server, 'get', id = friends_list)
        distance_dic = {}
        for i in range(len(friends_list)):
            distance_dic[friends_list[i]] = distance_record[i]['week_distance']
        rank = sorted(distance_dic.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
        return rank
    except:
        print('There is no such a record!')


# db_server = get_server()

# data1 = {'_id':'001', 'name': 'Yichao Xu', 'gender':'male', 'age': '18', 'phone': '123456', 'birthday':'2002-09-01'}
# data2 = {'_id':'002', 'name': 'Ye Yang', 'gender':'male', 'age': '19', 'phone': '123456', 'birthday':'2001-09-01'}
# data3 = {'_id':'003', 'name': 'Ruocheng Ning', 'gender':'male', 'age': '20', 'phone': '123456', 'birthday':'2000-09-01'}
#
# data4 = {'_id':'002', 'name': 'Ye Yang', 'gender':'male', 'age': '19', 'phone': '123456', 'birthday':'2017-09-01'}
# db_operate(db_server, 'personal_info', 'create',  data = data1)

# # Running records
# data1 = {'user_id': '001', 'start_time': '2020-09-21 21:26:00', 'end_time':'2020-09-21 22:26:00',
#         'distance': '5.51', 'coordinate': [(1, 2), (2, 3), (3, 4)]}
# data2 = {'user_id': '002', 'start_time': '2020-09-22 22:26:00', 'end_time':'2020-09-21 23:26:00',
#         'distance': '5.51', 'coordinate': [(1, 2), (2, 3), (3, 4)]}
# data3 = {'user_id': '003', 'start_time': '2020-09-20 20:26:00', 'end_time':'2020-09-21 22:26:00',
#         'distance': '5.51', 'coordinate': [(1, 2), (2, 3), (3, 4)]}
# data4 = {'user_id': '003', 'start_time': '2020-09-20 20:26:00', 'end_time':'2020-09-21 22:26:00',
#         'distance': '5.51', 'coordinate': [(1, 2), (2, 3), (3, 4)]}
#
# doc = db_runningrecord(db_server, 'get', query_key = [['001', '2020-09-01'],['002', '2020-10-01']])
# db_runningrecord(db_server, 'delete', id = 'a73d9e593ed929e6d702b6391001e653')
# print(doc)
