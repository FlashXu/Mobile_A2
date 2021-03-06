# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class UpdateFriends(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """

    def __init__(self, id: str=None, operation: str=None, friends: List[str]=None):  # noqa: E501
        """UpdateFriends - a model defined in Swagger

        :param id: The id of this UpdateFriends.  # noqa: E501
        :type id: str
        :param operation: The operation of this UpdateFriends.  # noqa: E501
        :type operation: str
        :param friends: The friends of this UpdateFriends.  # noqa: E501
        :type friends: List[str]
        """
        self.swagger_types = {
            'id': str,
            'operation': str,
            'friends': List[str]
        }

        self.attribute_map = {
            'id': '_id',
            'operation': 'operation',
            'friends': 'friends'
        }

        self._id = id
        self._operation = operation
        self._friends = friends

    @classmethod
    def from_dict(cls, dikt) -> 'UpdateFriends':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The updateFriends of this UpdateFriends.  # noqa: E501
        :rtype: UpdateFriends
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> str:
        """Gets the id of this UpdateFriends.


        :return: The id of this UpdateFriends.
        :rtype: str
        """
        return self._id

    @id.setter
    def id(self, id: str):
        """Sets the id of this UpdateFriends.


        :param id: The id of this UpdateFriends.
        :type id: str
        """
        if id is None:
            raise ValueError("Invalid value for `id`, must not be `None`")  # noqa: E501

        self._id = id

    @property
    def operation(self) -> str:
        """Gets the operation of this UpdateFriends.


        :return: The operation of this UpdateFriends.
        :rtype: str
        """
        return self._operation

    @operation.setter
    def operation(self, operation: str):
        """Sets the operation of this UpdateFriends.


        :param operation: The operation of this UpdateFriends.
        :type operation: str
        """
        if operation is None:
            raise ValueError("Invalid value for `operation`, must not be `None`")  # noqa: E501

        self._operation = operation

    @property
    def friends(self) -> List[str]:
        """Gets the friends of this UpdateFriends.


        :return: The friends of this UpdateFriends.
        :rtype: List[str]
        """
        return self._friends

    @friends.setter
    def friends(self, friends: List[str]):
        """Sets the friends of this UpdateFriends.


        :param friends: The friends of this UpdateFriends.
        :type friends: List[str]
        """
        if friends is None:
            raise ValueError("Invalid value for `friends`, must not be `None`")  # noqa: E501

        self._friends = friends
