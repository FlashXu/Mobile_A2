import connexion
import six

from swagger_server.models.create_account import CreateAccount  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.update_account import UpdateAccount  # noqa: E501
from swagger_server import util


def accounts_auth_post(body):  # noqa: E501
    """Auth an existing account info and obtain its id.

     # noqa: E501

    :param body: Account info. includes users&#39; user name and password.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def accounts_delete(body):  # noqa: E501
    """Delete an existing account.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def accounts_get(id):  # noqa: E501
    """Get an existing account info.

     # noqa: E501

    :param id: user id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'


def accounts_post(body):  # noqa: E501
    """Add a new account to db.

     # noqa: E501

    :param body: Account info. includes users&#39; user name and password.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def accounts_put(body):  # noqa: E501
    """Update an existing account.

     # noqa: E501

    :param body: Account new detailed info.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = UpdateAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
