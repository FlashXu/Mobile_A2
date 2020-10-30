import smtplib
from email.mime.text import MIMEText
from email.header import Header
import random
import datetime
import db_op

def verify_step1(db_server, user_name):
    accounts_db = db_server['accounts']
    record_list = accounts_db.view('auth/auth', start_key=[user_name], end_key=[user_name + 'CHANGE'])
    if len(record_list) == 0:
        return 404
    record_list = list(record_list)
    account_id = record_list[0].value
    resp, verify_code = send_verify_code(user_name)
    if resp != 200:
        return resp
    data = {'_id': account_id, 'user_name': user_name, 'verify_code': verify_code,
            'verify_time': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    resp = db_op.db_operate(db_server, 'verify', 'update', data = data)
    return resp

def verify_step2(db_server, user_name, verify_code):
    db = db_server['verify']
    record_list = db.view('verify/verify', start_key=[user_name], end_key=[user_name + 'CHANGE'])
    if len(record_list) == 0:
        return 404, ''
    record_list = list(record_list)
    account_id = record_list[0].value
    doc = dict(db[account_id])
    recorded_code = doc['verify_code']
    recorded_time = doc['verify_time']
    if verify_code != recorded_code:
        return 409, ''
    elif isTimeOut(recorded_time, 120):
        return 410, ''
    else:
        return 200, account_id

def send_verify_code(receiver):
    mail_username = 'runningguysservice@gmail.com'
    mail_password = 'mobile09'
    # HOST & PORT
    HOST = 'smtp.gmail.com'
    sender = mail_username
    verify_code = ''
    for i in range(4):
        verify_code += str(random.randint(0,9))
    message = MIMEText('Your verify code is: ' + verify_code + '.', 'plain', 'utf-8')
    # message['From'] = Header("RunningGuysService", 'utf-8')
    # message['To'] =  Header(receivers, 'utf-8')
    receiver = [receiver]
    subject = 'Forget Password'
    message['Subject'] = Header(subject, 'utf-8')
    try:
        smtpObj = smtplib.SMTP_SSL(HOST)
        smtpObj.ehlo(HOST)
        smtpObj.login(mail_username, mail_password)
    except:
        print('CONNECT ERROR ****')
        return 411,''
    try:
        smtpObj.sendmail(sender, receiver, message.as_string())
        print("Success.")
        return 200, verify_code
    except smtplib.SMTPException:
        print("Error in sending email.")
        return 412,''

def isTimeOut(last_time, limit_seconds):
    assert type(last_time) == str
    last_time = datetime.datetime.strptime(last_time, "%Y-%m-%d %H:%M:%S")
    now = datetime.datetime.now()
    diff = now - last_time
    if  (diff.days == 0) and (diff.seconds < limit_seconds):
        return False
    else:
        return True
