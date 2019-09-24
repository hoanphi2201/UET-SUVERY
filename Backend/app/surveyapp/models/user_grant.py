# coding=utf-8
import logging
from uuid import uuid4
from surveyapp.models import db, TimestampMixin
from .role_grant import Table

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class UserGrant(db.Model, TimestampMixin):
    __tablename__ = 'user_grant'

    def __init__(self, **kwargs):
        if not kwargs.get('id'):
            setattr(self, 'id', uuid4().hex)
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.String(255), primary_key=True)
    table_name = db.Column(db.Enum(Table), nullable=False)
    record_id = db.Column(db.String(255), nullable=False)
    can_view = db.Column(db.Boolean(), nullable=False)
    can_update = db.Column(db.Boolean(), nullable=False)
    can_delete = db.Column(db.Boolean(), nullable=False)
    user_id = db.Column(db.String(255), db.ForeignKey('user.id'))



