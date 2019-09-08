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
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    json = db.Column(db.Text())
    status = db.Column(db.Enum(Status), default=Status.DRAFT)
    is_visible = db.Column(db.Boolean(), default=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    respondents = relationship('User', secondary=association_table, back_populates="survey_available")

    survey_answer = relationship("SurveyAnswer", cascade="save-update, merge, delete")


class SurveyModel:
    survey_add_model = {
        'name': fields.String(required=True),
        'json': fields.String(required=True),
        'status': fields.String(enum=Status._member_names_),
        'is_visible': fields.Boolean(),
        'respondents_id': fields.List(fields.Integer)
    }
