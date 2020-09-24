# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.create_friends import CreateFriends  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.update_friends import UpdateFriends  # noqa: E501
from swagger_server.test import BaseTestCase


class TestFriendsListController(BaseTestCase):
    """FriendsListController integration test stubs"""

    def test_friends_list_delete(self):
        """Test case for friends_list_delete

        Delete existing friends info.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/friends_list',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_friends_list_get(self):
        """Test case for friends_list_get

        Get existing friends info.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/friends_list',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_friends_list_post(self):
        """Test case for friends_list_post

        Add the users' friends list to db.
        """
        body = CreateFriends()
        response = self.client.open(
            '/friends_list',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_friends_list_put(self):
        """Test case for friends_list_put

        Update existing friends info.
        """
        body = UpdateFriends()
        response = self.client.open(
            '/friends_list',
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
