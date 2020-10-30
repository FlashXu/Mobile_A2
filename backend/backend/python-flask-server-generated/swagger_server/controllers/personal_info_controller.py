import connexion
import six

from swagger_server.models.create_personal import CreatePersonal  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server import util


def personal_info_delete(body):  # noqa: E501
    """Delete existing personal info.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def personal_info_get(id):  # noqa: E501
    """Get existing personal info.

     # noqa: E501

    :param id: user id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'


def personal_info_post(body):  # noqa: E501
    """Add a new personal info to db.

     # noqa: E501

    :param body: Personal info. includes _id (same with the one in accounts), name, gender, age, phone and email.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreatePersonal.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def personal_info_put(body):  # noqa: E501
    """Update existing personal info.

     # noqa: E501

    :param body: New personal info.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreatePersonal.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
