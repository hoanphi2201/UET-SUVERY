# coding=utf-8
import logging
import enum
from flask_restplus import fields
from sqlalchemy.orm import relationship
from surveyapp.models import db, TimestampMixin
from . import association_table

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class Status(enum.Enum):
    DRAFT = 'DRAFT'
    OPEN = 'OPEN'
    CLOSE = 'CLOSE'


class SurveyForm(db.Model, TimestampMixin):
    __tablename__ = 'survey_form'

    def __init__(self, **kwargs):
        self.update_attr(**kwargs)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    json = db.Column(db.Text())
    status = db.Column(db.Enum(Status), default=Status.DRAFT)
    is_visible = db.Column(db.Boolean(), default=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    respondents = relationship('User', secondary=association_table, back_populates="survey_available")

    survey_answer = relationship("SurveyAnswer", cascade="save-update, merge, delete")

    def update_attr(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'json': self.json,
            'status': self.status.value,
            'is_visible': self.is_visible,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'owner_id': self.owner_id,
            'respondents_id': [x.id for x in self.respondents]
        }


class SurveyModel:
    survey_model = {
        'id': fields.Integer,
        'name': fields.String(),
        'json': fields.String(),
        'status': fields.String(),
        'is_visible': fields.Boolean(),
        'created_at': fields.DateTime(),
        'updated_at': fields.DateTime(),
        'owner_id': fields.Integer,
        'respondents_id': fields.List(fields.Integer)
    }

    survey_add_model = {
        'name': fields.String(required=True),
        'json': fields.String(required=True),
        'status': fields.String(enum=Status._member_names_),
        'is_visible': fields.Boolean(),
        'respondents_id': fields.List(fields.Integer)
    }

    survey_edit_model = {
        'name': fields.String(),
        'json': fields.String(),
        'status': fields.String(enum=Status._member_names_),
        'is_visible': fields.Boolean(),
        'respondents_id': fields.List(fields.Integer)
    }
