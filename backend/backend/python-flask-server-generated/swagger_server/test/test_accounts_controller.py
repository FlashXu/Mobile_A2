# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.create_account import CreateAccount  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.update_account import UpdateAccount  # noqa: E501
from swagger_server.test import BaseTestCase


class TestAccountsController(BaseTestCase):
    """AccountsController integration test stubs"""

    def test_accounts_auth_post(self):
        """Test case for accounts_auth_post

        Auth an existing account info and obtain its id.
        """
        body = CreateAccount()
        response = self.client.open(
            '/accounts/auth',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_accounts_delete(self):
        """Test case for accounts_delete

        Delete an existing account.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/accounts',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_accounts_get(self):
        """Test case for accounts_get

        Get an existing account info.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/accounts',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_accounts_post(self):
        """Test case for accounts_post

        Add a new account to db.
        """
        body = CreateAccount()
        response = self.client.open(
            '/accounts',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_accounts_put(self):
        """Test case for accounts_put

        Update an existing account.
        """
        body = UpdateAccount()
        response = self.client.open(
            '/accounts',
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
