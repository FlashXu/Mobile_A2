import connexion
import six

from swagger_server.models.create_record import CreateRecord  # noqa: E501
from swagger_server.models.delete_account import DeleteAccount  # noqa: E501
from swagger_server.models.query import Query  # noqa: E501
from swagger_server import util


def running_record_delete(body):  # noqa: E501
    """Delete an existing running record.

     # noqa: E501

    :param body: Only contain id or id list.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DeleteAccount.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def running_record_get(id):  # noqa: E501
    """Get an existing running record.

     # noqa: E501

    :param id: record id
    :type id: str

    :rtype: None
    """
    return 'do some magic!'


def running_record_post(body):  # noqa: E501
    """Add a new running record to db.

     # noqa: E501

    :param body: Running record includes user_id, start_time, end_time, coordinate, distance.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = CreateRecord.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def running_record_query_delete(body):  # noqa: E501
    """Delete running records by query.

     # noqa: E501

    :param body: Same format as querying existing running records, only contain query_key.
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = Query.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def running_record_query_post(body):  # noqa: E501
    """Query running records.

     # noqa: E501

    :param body: Queries only include query key with the format:  [[_id1, start_time1],[_id2, start_time2]].
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = Query.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'
