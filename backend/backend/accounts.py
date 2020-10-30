from flask import Flask, request, Blueprint
from couchdb import ResourceConflict, ResourceNotFound
import db_op
import forget_pwd
import smtplib
from email.mime.text import MIMEText
from email.header import Header

def send_welcome_email(receiver):
    mail_username = 'runningguysservice@gmail.com'
    mail_password = 'mobile09'
    # HOST & PORT
    HOST = 'smtp.gmail.com'
    sender = mail_username
    welcome_str = "Dear Customer,\n\n    Welcome to use our app! Hope you enjoy our running projects! :)"
    message = MIMEText(welcome_str, 'plain', 'utf-8')
    receiver = [receiver]
    subject = 'Welcome To Use Our Running App'
    message['Subject'] = Header(subject, 'utf-8')
    try:
        smtpObj = smtplib.SMTP_SSL(HOST)
        smtpObj.ehlo(HOST)
        smtpObj.login(mail_username, mail_password)
    except:
        print('CONNECT ERROR ****')
        return 411
    try:
        smtpObj.sendmail(sender, receiver, message.as_string())
        print("Success.")
        return 200
    except smtplib.SMTPException:
        print("Error in sending email.")
        return 412

# Handle database
def db_accounts(db_server, operation, id = '', data = {}):
    if operation.lower() == 'create':
        # Check unique user_name
        db = db_server['accounts']
        user_name = data['user_name']
        record_list = db.view('auth/auth', start_key = [user_name], end_key = [user_name + 'CHANGE'])
        if len(record_list) != 0:
            return 406, ''
        res = send_welcome_email(user_name)
        if res == 200:
            resp, gen_id= db_op.db_operate(db_server, 'accounts', operation, data = data)
        else:
            resp = res
            gen_id = ''
        return resp, gen_id

    elif operation.lower() == 'get':
        if id == '':
            return 404, []
        resp, account_info = db_op.db_operate(db_server, 'accounts', operation, id = id)
        return resp, account_info

    elif operation.lower() == 'auth':
        db = db_server['accounts']
        query_key = [data['user_name'], data['pwd']]
        record_list = db.view('auth/auth', start_key=query_key, end_key = query_key)
        if len(record_list) == 0:
            print('User_name of password wrong!')
            return 404, ''
        id_list = []
        for row in record_list:
            id_list.append(row.value)
        return 200, id_list[0]

    # Change password.
    elif operation.lower() == 'update':
        db = db_server['accounts']
        try:
            doc = db[data['_id']]
            resp = db_op.db_operate(db_server, 'accounts', operation, data=data)
        except ResourceNotFound:
            resp = 404
        return resp

    elif operation.lower() == 'delete':
        if id == '':
            return 404
        resp = db_op.db_operate(db_server, 'accounts', operation, id = id)
        return resp

    elif operation.lower() == 'exist':
        db = db_server['accounts']
        user_name = data['user_name']
        record_list = db.view('auth/auth', start_key=[user_name], end_key=[user_name + 'CHANGE'])
        if len(record_list) != 0:
            gen_id = ''
            for row in record_list:
                gen_id = row.value
            return 200, gen_id
        else:
            return 404, ''

# Flask for accounts.
accounts_handler = Blueprint('accounts', __name__)
db_server = db_op.get_server()
@accounts_handler.route('', methods=['POST', 'DELETE', 'PUT', 'GET'])
def resp_account():
    response = {}
    if request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        resp, gen_id = db_accounts(db_server, 'create', data = data)
        response['resp'] = resp
        response['gen_id'] = gen_id
        return response
    elif request.method == 'DELETE':
        data = eval(str(request.data, encoding="utf-8"))
        id = data['_id']
        resp = db_accounts(db_server, 'delete', id = id)
        response['resp'] = resp
        return response
    elif request.method == 'PUT':
        data = eval(str(request.data, encoding="utf-8"))
        resp = db_accounts(db_server, 'update', data = data)
        response['resp'] = resp
        return response
    elif request.method == 'GET':
        id = request.args.get('id')
        resp, account_info = db_accounts(db_server, 'get', id = id)
        response['resp'] = resp
        response['account_info'] = account_info
        return response

# Handling login.
@accounts_handler.route('/auth', methods=['POST'])
def resp_account_auth():
    response = {}
    data = eval(str(request.data, encoding="utf-8"))
    resp, gen_id = db_accounts(db_server, 'auth', data=data)
    response['resp'] = resp
    response['gen_id'] = gen_id
    return response

# Handing forget password.
@accounts_handler.route('/forget_pwd', methods=['GET', 'POST', 'DELETE'])
def resp_account_forgetpwd():
    response = {}
    if request.method == 'GET':
        user_name = request.args.get('user_name')
        resp = forget_pwd.verify_step1(db_server, user_name)
        response['resp'] = resp
        return response
    elif request.method == 'POST':
        data = eval(str(request.data, encoding="utf-8"))
        user_name = data['user_name']
        verify_code = data['verify_code']
        resp, id = forget_pwd.verify_step2(db_server, user_name, verify_code)
        response['resp'] = resp
        response['gen_id'] = id
        return response
    elif request.method == 'DELETE':
        id = request.args.get('id')
        print(id)
        resp = db_op.db_operate(db_server, 'verify', 'delete', id = id)
        response['resp'] = resp
        return response

# Handing forget password.
@accounts_handler.route('/exist', methods=['GET'])
def resp_account_checkexist():
    response = {}
    if request.method == 'GET':
        user_name = request.args.get('user_name')
        data = {'user_name': user_name}
        resp, gen_id = db_accounts(db_server, 'exist', data = data)
        response['resp'] = resp
        response['gen_id'] = gen_id
        return response



