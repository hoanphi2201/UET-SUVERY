# coding=utf-8
import logging
from flask import Blueprint
from flask_restplus import Api
from surveyapp.extensions.exceptions import global_error_handler

__author__ = 'Teko'
_logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__, url_prefix='/api')

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

api = Api(
    app=api_bp,
    version='1.0',
    title='Survey API',
    validate=False,
    authorizations=authorizations,
    security= 'apikey',
)


def init_app(app, **kwargs):
    """
    :param flask.Flask app: the app
    :param kwargs:
    :return:
    """
    app.register_blueprint(api_bp)
    api.error_handlers[Exception] = global_error_handler

