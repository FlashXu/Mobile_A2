import connexion
import six

from swagger_server.models.create_comment import CreateComment  # noqa: E501
from swagger_server.models.create_moment import CreateMoment  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.query import Query  # noqa: E501
from swagger_server import util


def moments_comment_post(body):  # noqa: E501
    """Comment to a moment.

     # noqa: E501

    :param body: A comment includes _id (moment id), user_id(who comment it), time, contents.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateComment.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def moments_delete(body):  # noqa: E501
    """Delete an existing moment.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def moments_get(id):  # noqa: E501
    """Get an existing moment.

     # noqa: E501

    :param id: user id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'


def moments_post(body):  # noqa: E501
    """Create a new moment to db.

     # noqa: E501

    :param body: A moment includes user&#39;s user_id, time, comments and contents.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateMoment.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def moments_query_delete(body):  # noqa: E501
    """Delete moments by query.

     # noqa: E501

    :param body: Same format as querying existing moments, only contain query_key.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = Query.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def moments_query_post(body):  # noqa: E501
    """Query moments.

     # noqa: E501

    :param body: Queries only include query key with the format:  [[user_id1, time1],[user_id2, time2]].
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = Query.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
