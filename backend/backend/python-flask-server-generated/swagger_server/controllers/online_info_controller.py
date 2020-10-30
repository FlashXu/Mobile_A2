import connexion
import six

from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.get_online import GetOnline  # noqa: E501
from swagger_server.models.update_online import UpdateOnline  # noqa: E501
from swagger_server import util


def online_info_delete(body):  # noqa: E501
    """Delete existing online info.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def online_info_get_online_list_post(body):  # noqa: E501
    """Get the users&#39; online info.

     # noqa: E501

    :param body: Include id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = GetOnline.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def online_info_put(body):  # noqa: E501
    """Update/create online info.

     # noqa: E501

    :param body: Include &#39;_id&#39; and &#39;status&#39;.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = UpdateOnline.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
