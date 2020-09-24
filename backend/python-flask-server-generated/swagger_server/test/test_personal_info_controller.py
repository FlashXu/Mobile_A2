# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.create_personal import CreatePersonal  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.test import BaseTestCase


class TestPersonalInfoController(BaseTestCase):
    """PersonalInfoController integration test stubs"""

    def test_personal_info_delete(self):
        """Test case for personal_info_delete

        Delete existing personal info.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/personal_info',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_personal_info_get(self):
        """Test case for personal_info_get

        Get existing personal info.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/personal_info',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_personal_info_post(self):
        """Test case for personal_info_post

        Add a new personal info to db.
        """
        body = CreatePersonal()
        response = self.client.open(
            '/personal_info',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_personal_info_put(self):
        """Test case for personal_info_put

        Update existing personal info.
        """
        body = CreatePersonal()
        response = self.client.open(
            '/personal_info',
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
