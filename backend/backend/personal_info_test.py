import couchdb
from flask import Flask, request
from couchdb import ResourceConflict, ResourceNotFound
import db_op

db_server = db_op.get_server()
db = db_server['personal_info']

# Data
data1 = {"id" : "139cead802d001cef8a21b6c76078470",
         "name": "Yichao Xu", "phone":"123456", "gender": "male", "age": "18", "email": "111@qq.com"}
data2 = {"id" : "139cead802d001cef8a21b6c760799e8",
         "name": "Ruocheng Ning", "phone":"123456", "gender": "male", "age": "18", "email": "111@qq.com"}