import couchdb
from couchdb import ResourceConflict, ResourceNotFound

def get_server(url='35.220.242.6:5984', username='admin', password='mobile'):
    db_path = f'http://{username}:{password}@{url}/'
    return couchdb.Server(db_path)

def db_operate(db_server, db_name, operation, id = [], data = {}):
    # Validate the database.
    try:
        db = db_server[db_name]
    except ResourceNotFound:
        print('There is no database named ' + db_name + '!')
        return 407

    # Validate the data.
    try:
        assert type(data) == dict
    except AssertionError:
        print('The data should be in dict form!')
        return 408

    # Create new file.
    if operation.lower() == 'create':
        try:
            doc = db.save(data)
            return 200, doc[0]
        except ResourceConflict:
            print("Info already existed!")
            return 406, ''

    # Get existed file by id.
    elif operation.lower() == 'get':
        if type(id) != list:
            id = [id]
        list_info = []
        for i in range(len(id)):
            try:
                doc = dict(db[id[i]])
                list_info.append(doc)
            except ResourceNotFound:
                print('There is no such a file!')
        return 200, list_info

    # Update existed file.
    elif operation.lower() == 'update':
        if type(data) != list:
            data = [data]
        for i in range(len(data)):
            current_id  = data[i]['_id']
            try:
                doc = db[current_id]
                db.purge([doc])
                db.compact()
                db.save(data[i])
            except ResourceNotFound:
                db.save(data[i])
        return 200

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
        return 200




