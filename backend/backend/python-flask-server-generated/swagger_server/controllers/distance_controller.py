import connexion
import six

from swagger_server.models.create_distance import CreateDistance  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server import util


def distance_delete(body):  # noqa: E501
    """Delete an existing distance record.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def distance_get(id):  # noqa: E501
    """Get an existing distance record.

     # noqa: E501

    :param id: user id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'


def distance_post(body):  # noqa: E501
    """Add a new record of distance to db.

     # noqa: E501

    :param body: Distance info. includes users&#39; _id, start_time and distance
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateDistance.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def distance_put(body):  # noqa: E501
    """Update an existing distance record.

     # noqa: E501

    :param body: New running record includes user&#39;s _id, start_time and distance.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateDistance.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def distance_weekly_ranking_get(id):  # noqa: E501
    """Get this week&#39;s distance ranking for a user.

     # noqa: E501

    :param id: user id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'
