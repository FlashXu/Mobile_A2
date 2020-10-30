# coding: utf-8

from __future__ import absolute_import
from datetime import date, datetime  # noqa: F401

from typing import List, Dict  # noqa: F401

from swagger_server.models.base_model_ import Model
from swagger_server import util


class UpdateAccount(Model):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """

    def __init__(self, id: str=None, user_name: str=None, pwd: str=None):  # noqa: E501
        """UpdateAccount - a model defined in Swagger

        :param id: The id of this UpdateAccount.  # noqa: E501
        :type id: str
        :param user_name: The user_name of this UpdateAccount.  # noqa: E501
        :type user_name: str
        :param pwd: The pwd of this UpdateAccount.  # noqa: E501
        :type pwd: str
        """
        self.swagger_types = {
            'id': str,
            'user_name': str,
            'pwd': str
        }

        self.attribute_map = {
            'id': '_id',
            'user_name': 'user_name',
            'pwd': 'pwd'
        }

        self._id = id
        self._user_name = user_name
        self._pwd = pwd

    @classmethod
    def from_dict(cls, dikt) -> 'UpdateAccount':
        """Returns the dict as a model

        :param dikt: A dict.
        :type: dict
        :return: The updateAccount of this UpdateAccount.  # noqa: E501
        :rtype: UpdateAccount
        """
        return util.deserialize_model(dikt, cls)

    @property
    def id(self) -> str:
        """Gets the id of this UpdateAccount.


        :return: The id of this UpdateAccount.
        :rtype: str
        """
        return self._id

    @id.setter
    def id(self, id: str):
        """Sets the id of this UpdateAccount.


        :param id: The id of this UpdateAccount.
        :type id: str
        """
        if id is None:
            raise ValueError("Invalid value for `id`, must not be `None`")  # noqa: E501

        self._id = id

    @property
    def user_name(self) -> str:
        """Gets the user_name of this UpdateAccount.


        :return: The user_name of this UpdateAccount.
        :rtype: str
        """
        return self._user_name

    @user_name.setter
    def user_name(self, user_name: str):
        """Sets the user_name of this UpdateAccount.


        :param user_name: The user_name of this UpdateAccount.
        :type user_name: str
        """
        if user_name is None:
            raise ValueError("Invalid value for `user_name`, must not be `None`")  # noqa: E501

        self._user_name = user_name

    @property
    def pwd(self) -> str:
        """Gets the pwd of this UpdateAccount.


        :return: The pwd of this UpdateAccount.
        :rtype: str
        """
        return self._pwd

    @pwd.setter
    def pwd(self, pwd: str):
        """Sets the pwd of this UpdateAccount.


        :param pwd: The pwd of this UpdateAccount.
        :type pwd: str
        """
        if pwd is None:
            raise ValueError("Invalid value for `pwd`, must not be `None`")  # noqa: E501

        self._pwd = pwd