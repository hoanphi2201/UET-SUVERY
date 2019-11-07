# coding=utf-8
import logging
from flask import Blueprint
from flask_restplus import Api
from surveyapp.extensions.exceptions import global_error_handler
from .auth import ns as auth_ns
from .survey import ns as survey_ns
from .user import ns as user_ns
from .role import ns as role_ns
from surveyapp import jwt

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
    jwt._set_error_handler_callbacks(api)
    app.register_blueprint(api_bp)
    api.add_namespace(survey_ns)
    api.add_namespace(user_ns)
    api.add_namespace(auth_ns)
    api.add_namespace(role_ns)

    api.error_handlers[Exception] = global_error_handler


