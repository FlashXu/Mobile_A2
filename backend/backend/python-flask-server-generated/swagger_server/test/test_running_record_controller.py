# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.create_record import CreateRecord  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.query import Query  # noqa: E501
from swagger_server.test import BaseTestCase


class TestRunningRecordController(BaseTestCase):
    """RunningRecordController integration test stubs"""

    def test_running_record_delete(self):
        """Test case for running_record_delete

        Delete an existing running record.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/running_record',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_running_record_get(self):
        """Test case for running_record_get

        Get an existing running record.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/running_record',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_running_record_post(self):
        """Test case for running_record_post

        Add a new running record to db.
        """
        body = CreateRecord()
        response = self.client.open(
            '/running_record',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_running_record_query_delete(self):
        """Test case for running_record_query_delete

        Delete running records by query.
        """
        body = Query()
        response = self.client.open(
            '/running_record/query',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_running_record_query_post(self):
        """Test case for running_record_query_post

        Query running records.
        """
        body = Query()
        response = self.client.open(
            '/running_record/query',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
