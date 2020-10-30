# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.create_distance import CreateDistance  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.test import BaseTestCase


class TestDistanceController(BaseTestCase):
    """DistanceController integration test stubs"""

    def test_distance_delete(self):
        """Test case for distance_delete

        Delete an existing distance record.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/distance',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_distance_get(self):
        """Test case for distance_get

        Get an existing distance record.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/distance',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_distance_post(self):
        """Test case for distance_post

        Add a new record of distance to db.
        """
        body = CreateDistance()
        response = self.client.open(
            '/distance',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_distance_put(self):
        """Test case for distance_put

        Update an existing distance record.
        """
        body = CreateDistance()
        response = self.client.open(
            '/distance',
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_distance_weekly_ranking_get(self):
        """Test case for distance_weekly_ranking_get

        Get this week's distance ranking for a user.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/distance/weekly_ranking',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
