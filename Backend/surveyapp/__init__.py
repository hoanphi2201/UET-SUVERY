# coding=utf-8
import logging
import flask
from surveyapp import services, models
import re

# from flask_cors import CORS

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)

SENTRY_DSN = 'SENTRY_DSN'


def _after_request(response):
    allowed_origins = [
        re.compile('https?://(.*\.)?localhost'),
        # re.compile('https?://(.*\.)?teko\.vn'),
        # re.compile('https?://(.*\.)?phongvu\.vn')
    ]

    origin = flask.request.headers.get('Origin')
    if origin:
        for allowed_origin in allowed_origins:
            if allowed_origin.match(origin):
                response.headers['Access-Control-Allow-Origin'] = origin

    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'

    return response


def create_app():
    import config
    import os

    from . import api, models
    from surveyapp import helpers

    def load_app_config(app):
        """
        Load app's configurations
        :param flask.Flask app:
        :return:
        """
        app.config.from_object(config)
        app.config.from_pyfile('config.py', silent=True)

    app = flask.Flask(
        __name__,
        instance_relative_config=True,
        instance_path=os.path.join(config.ROOT_DIR, 'instance')
    )
    app.json_encoder = helpers.JSONEncoder
    load_app_config(app)
    # CORS(app)
    app.after_request(_after_request)

    app.secret_key = config.FLASK_APP_SECRET_KEY
    models.init_app(app)
    api.init_app(app)
    services.init_app(app)
    return app


app = create_app()
