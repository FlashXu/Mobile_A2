# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.get_online import GetOnline  # noqa: E501
from swagger_server.models.update_online import UpdateOnline  # noqa: E501
from swagger_server.test import BaseTestCase


class TestOnlineInfoController(BaseTestCase):
    """OnlineInfoController integration test stubs"""

    def test_online_info_delete(self):
        """Test case for online_info_delete

        Delete existing online info.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/online_info',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_online_info_get_online_list_post(self):
        """Test case for online_info_get_online_list_post

        Get the users' online info.
        """
        body = GetOnline()
        response = self.client.open(
            '/online_info/get_online_list',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_online_info_put(self):
        """Test case for online_info_put

        Update/create online info.
        """
        body = UpdateOnline()
        response = self.client.open(
            '/online_info',
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
