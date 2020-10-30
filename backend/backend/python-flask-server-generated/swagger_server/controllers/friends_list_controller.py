import connexion
import six

from swagger_server.models.create_friends import CreateFriends  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.update_friends import UpdateFriends  # noqa: E501
from swagger_server import util


def friends_list_delete(body):  # noqa: E501
    """Delete existing friends info.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def friends_list_get(id):  # noqa: E501
    """Get existing friends info.

     # noqa: E501

    :param id: user id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'


def friends_list_post(body):  # noqa: E501
    """Add the users&#39; friends list to db.

     # noqa: E501

    :param body: Friends list includes _id (same with the one in accounts) and friends
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateFriends.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def friends_list_put(body):  # noqa: E501
    """Update existing friends info.

    For add/delete friends, please input the correct word (&#39;add&#39; or &#39;delete&#39;) in the field &#39;operation&#39;.  # noqa: E501

    :param body: New friends info you want to update.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = UpdateFriends.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
