# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.create_comment import CreateComment  # noqa: E501
from swagger_server.models.create_moment import CreateMoment  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.query import Query  # noqa: E501
from swagger_server.test import BaseTestCase


class TestMomentsController(BaseTestCase):
    """MomentsController integration test stubs"""

    def test_moments_comment_post(self):
        """Test case for moments_comment_post

        Comment to a moment.
        """
        body = CreateComment()
        response = self.client.open(
            '/moments/comment',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_moments_delete(self):
        """Test case for moments_delete

        Delete an existing moment.
        """
        body = DeleteAccount()
        response = self.client.open(
            '/moments',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_moments_get(self):
        """Test case for moments_get

        Get an existing moment.
        """
        query_string = [('id', 'id_example')]
        response = self.client.open(
            '/moments',
            method='GET',
            query_string=query_string)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_moments_post(self):
        """Test case for moments_post

        Create a new moment to db.
        """
        body = CreateMoment()
        response = self.client.open(
            '/moments',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_moments_query_delete(self):
        """Test case for moments_query_delete

        Delete moments by query.
        """
        body = Query()
        response = self.client.open(
            '/moments/query',
            method='DELETE',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_moments_query_post(self):
        """Test case for moments_query_post

        Query moments.
        """
        body = Query()
        response = self.client.open(
            '/moments/query',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
