# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class CreateFriends(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """

    def __init__(self, id: str=None, friends: List[str]=None):  # noqa: E501
        """CreateFriends - a model defined in Swagger

        :param id: The id of this CreateFriends.  # noqa: E501
        :type id: str
        :param friends: The friends of this CreateFriends.  # noqa: E501
        :type friends: List[str]
        """
        self.swagger_types = {
            'id': str,
            'friends': List[str]
        }

        self.attribute_map = {
            'id': '_id',
            'friends': 'friends'
        }

        self._id = id
        self._friends = friends

    @classmethod
    def from_dict(cls, dikt) -> 'CreateFriends':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The createFriends of this CreateFriends.  # noqa: E501
        :rtype: CreateFriends
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> str:
        """Gets the id of this CreateFriends.


        :return: The id of this CreateFriends.
        :rtype: str
        """
        return self._id

    @id.setter
    def id(self, id: str):
        """Sets the id of this CreateFriends.


        :param id: The id of this CreateFriends.
        :type id: str
        """
        if id is None:
            raise ValueError("Invalid value for `id`, must not be `None`")  # noqa: E501

        self._id = id

    @property
    def friends(self) -> List[str]:
        """Gets the friends of this CreateFriends.


        :return: The friends of this CreateFriends.
        :rtype: List[str]
        """
        return self._friends

    @friends.setter
    def friends(self, friends: List[str]):
        """Sets the friends of this CreateFriends.


        :param friends: The friends of this CreateFriends.
        :type friends: List[str]
        """
        if friends is None:
            raise ValueError("Invalid value for `friends`, must not be `None`")  # noqa: E501

        self._friends = friends