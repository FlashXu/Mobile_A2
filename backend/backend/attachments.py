from flask import Flask, request, Blueprint, send_file, make_response
from couchdb import ResourceConflict, ResourceNotFound
import db_op
from io import BytesIO

# Flask for attachments.
attachments_handler = Blueprint('attachments', __name__)
db_server = db_op.get_server()
@attachments_handler.route('/<db_name>/<id>/<file_name>', methods=['DELETE', 'PUT', 'GET'])
def resp_attachments(db_name, id, file_name):
    db_server = db_op.get_server()
    response = {}
    try:
        db = db_server[db_name]
    except ResourceNotFound:
        print('There is no database named ' + db_name + '!')
        return 407

    if request.method == 'DELETE':
        try:
            doc = db[id]
            db.delete_attachment(doc, file_name)
            db.compact()
            resp = 200
        except ResourceNotFound:
            resp = 404
        response['resp'] = resp
        return response

    elif request.method == 'PUT':
        try:
            img = request.get_data()
            assert type(img) == bytes
        except:
            response['resp'] = 408
            return response
        try:
            doc = db[id]
            db.put_attachment(doc, content = img, filename= file_name)
            db.compact()
            resp = 200
        except ResourceNotFound:
            resp = 404
        response['resp'] = resp
        return response

    elif request.method == 'GET':

        file = db.get_attachment(id, filename = file_name)
        if file != None:
            return send_file(
                        BytesIO(file.read()),
                        as_attachment = True,
                        attachment_filename = file_name
                     )
        else:
            response['resp'] = 404
            return response
