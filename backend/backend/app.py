from flask import Flask, request
import json
from accounts import accounts_handler
from friends_list import friends_list_handler
from personal_info import personal_info_handler
from online_info import online_info_handler
from running_record import running_record_handler
from moments import moments_handler
from distance import distance_handler
from attachments import attachments_handler
from flask_cors import CORS
import db_op

from gevent import monkey
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

# monkey.patch_all()
app = Flask(__name__)
# app.config.update(DEBUG=True)
CORS(app)

db_server = db_op.get_server()
app.register_blueprint(accounts_handler, url_prefix='/accounts')
app.register_blueprint(personal_info_handler, url_prefix='/personal_info')
app.register_blueprint(friends_list_handler, url_prefix='/friends_list')
app.register_blueprint(online_info_handler, url_prefix='/online_info')
app.register_blueprint(running_record_handler, url_prefix='/running_record')
app.register_blueprint(moments_handler, url_prefix='/moments')
app.register_blueprint(distance_handler, url_prefix='/distance')
app.register_blueprint(attachments_handler, url_prefix='/attachments')

@app.route('/')
def welcome():
    print("here!")
    return 'This is our app database, welcome!'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 5000, debug=True)
    # http_server = WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)
    # http_server.serve_forever()