# coding=utf-8
import logging
from uuid import uuid4
from surveyapp.models import db, TimestampMixin
import enum


__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class Table(enum.Enum):
    SURVEY = 'survey_form'
    USER = 'user'
    ROLE = 'role'
    ROLE_GRANT = 'role_grant'
    USER_GRANT = 'user_grant'


class RoleGrant(db.Model, TimestampMixin):
    __tablename__ = 'role_grant'

    def __init__(self, **kwargs):
        if not kwargs.get('id'):
            setattr(self, 'id', uuid4().hex)
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.String(255), primary_key=True)
    table_name = db.Column(db.Enum(Table), nullable=False)
    can_view_all = db.Column(db.Boolean(), nullable=False)
    can_create = db.Column(db.Boolean(), nullable=False)
    can_update = db.Column(db.Boolean(), nullable=False)
    can_delete = db.Column(db.Boolean(), nullable=False)
    role_id = db.Column(db.String(255), db.ForeignKey('role.id'))

