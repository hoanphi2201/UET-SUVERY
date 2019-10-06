# coding=utf-8
import logging
import enum
import json
from uuid import uuid4
from flask_restplus import fields
from sqlalchemy.orm import relationship
from surveyapp.models import db, TimestampMixin

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class Status(enum.Enum):
    DRAFT = 'DRAFT'
    OPEN = 'OPEN'
    CLOSE = 'CLOSE'


class SurveyForm(db.Model, TimestampMixin):
    __tablename__ = 'survey_form'

    def __init__(self, **kwargs):
        if not kwargs.get('id'):
            setattr(self, 'id', uuid4().hex)
        self.update_attr(**kwargs)

    id = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.Text, nullable=False)
    config = db.Column(db.JSON())
    status = db.Column(db.Enum(Status), default=Status.OPEN)
    owner_id = db.Column(db.String(255), db.ForeignKey('user.id'))
    link_collection = relationship("LinkCollection", cascade="save-update, merge, delete")
    invite_collection = relationship("InviteCollection", cascade="save-update, merge, delete")
    email_collection = relationship("EmailCollection", cascade="save-update, merge, delete")

    def update_attr(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'config': json.dumps(self.config),
            'status': self.status.value,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'owner_id': self.owner_id,
        }


class SurveyModel:
    survey_model = {
        'id': fields.String(),
        'name': fields.String(),
        'config': fields.String(),
        'status': fields.String(),
        'created_at': fields.DateTime(),
        'updated_at': fields.DateTime(),
        'owner_id': fields.String(),
    }

    survey_add_model = {
        'name': fields.String(required=True),
        'config': fields.String(required=True),
    }

    survey_edit_model = {
        'name': fields.String(),
        'config': fields.String(),
    }
