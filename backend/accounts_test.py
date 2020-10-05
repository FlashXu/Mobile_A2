import couchdb
from flask import Flask, request
from couchdb import ResourceConflict, ResourceNotFound
import db_op

import accounts
db_server = db_op.get_server()
db = db_server['accounts']

data1 = {'user_name': "Yichao Xu", "pwd": "123456"}
data2 = {'user_name': "Ruocheng Ning", "pwd": "123456"}
data3 = {'user_name': "Yizi Han", "pwd": "123456"}
data4 = {'user_name': "Ye Yang", "pwd": "123456"}
data5 = {'user_name': "Minghui Li", "pwd": "123456"}
data6 = {'user_name': "Jiawei Ren", "pwd": "123456"}

whole_data = [data1, data2, data3, data4, data5, data6]
id_list = []

# Create Test
for i in range(6):
    resp, id = accounts.db_account(db_server, 'create', data = whole_data[i])
    id_list.append(id)
    print(resp, ' ', id)

# Auth Test
id_list = []
for i in range(6):
    resp, id = accounts.db_account(db_server, 'auth', data = whole_data[i])
    id_list.append(id)
    print(resp, ' ', id)

# Get Test
for i in range(6):
    resp, account_info = accounts.db_account(db_server, 'get', id = id_list[i])
    print(resp, ' ', account_info)

# Delete Test
for i in range(6):
    resp = accounts.db_account(db_server, 'delete', id = id_list[i])
    print(resp)




