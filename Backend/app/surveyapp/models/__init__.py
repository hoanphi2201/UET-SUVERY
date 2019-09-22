# coding=utf-8
import logging

import flask_bcrypt as _fb
import flask_migrate as _fm
import flask_sqlalchemy as _fs

__author__ = 'Teko'
_logger = logging.getLogger(__name__)

db = _fs.SQLAlchemy()
migrate = _fm.Migrate(db=db)
bcrypt = _fb.Bcrypt()


def init_app(app, **kwargs):
    """
    Extension initialization point
    :param flask.Flask app:
    :param kwargs:
    :return:
    """
    db.app = app
    db.init_app(app)
    migrate.init_app(app)
    _logger.info('Start app in {env} environment with database: {db}'.format(
        env=app.config['ENV_MODE'],
        db=app.config['SQLALCHEMY_DATABASE_URI']
    ))


from .base import TimestampMixin
from .user import User
from .survey_form import SurveyForm, SurveyModel
from .survey_answer import SurveyAnswer
from .revoked_token import RevokedToken
from .role import Role, role_function_table
from .function import Function
# from .role_grant import RoleGrant
# from .user_grant import UserGrant
from .survey_link import SurveyLink
