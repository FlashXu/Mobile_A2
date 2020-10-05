import couchdb
from flask import Flask, request
from couchdb import ResourceConflict, ResourceNotFound
import db_op
import friends_list
db_server = db_op.get_server()
db = db_server['friends_list']

data1 = {'_id': '139cead802d001cef8a21b6c76078470', 'friends': ["139cead802d001cef8a21b6c760799e8","139cead802d001cef8a21b6c7607a800"]}
data2 = {'_id': '139cead802d001cef8a21b6c7607a800', 'friends': ["139cead802d001cef8a21b6c760799e8","139cead802d001cef8a21b6c76078470"]}

data3 = {'_id': '139cead802d001cef8a21b6c76078470', 'friends': ["139cead802d001cef8a21b6c7607d3c7"]}
data4 = {'_id': '139cead802d001cef8a21b6c7607a800', 'friends': ["139cead802d001cef8a21b6c7607d3c7"]}


# Test add friends.
resp = friends_list.db_friendlist(db_server, 'add', data = data1)
print(resp)
resp = friends_list.db_friendlist(db_server, 'add', data = data2)
print(resp)

# Test delete some friends.
data3 = {'_id': '139cead802d001cef8a21b6c76078470', 'friends': ["139cead802d001cef8a21b6c760799e8","139cead802d001cef8a21b6c76078470"]}
data4 = {'_id': '139cead802d001cef8a21b6c7607a800', 'friends': ["139cead802d001cef8a21b6c760799e8","139cead802d001cef8a21b6c7607a800"]}
resp = friends_list.db_friendlist(db_server, 'delete', data = data3)
print(resp)
resp = friends_list.db_friendlist(db_server, 'delete', data = data4)
print(resp)

# Test get friends.
resp, f_list = friends_list.db_friendlist(db_server, 'get', id = "139cead802d001cef8a21b6c76078470")
print(resp, ' ', f_list)

# Test delete whole friends.
resp = friends_list.db_friendlist(db_server, 'delete_all', id = data1['_id'])
print(resp)
resp = friends_list.db_friendlist(db_server, 'delete_all', id = data2['_id'])
print(resp)