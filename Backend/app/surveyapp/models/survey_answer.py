# coding=utf-8
import logging
from flask_restplus import fields
from sqlalchemy.orm import relationship
from surveyapp.models import db, bcrypt, TimestampMixin


__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class SurveyAnswer(db.Model, TimestampMixin):
    __tablename__ = 'survey_answer'

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.String(255), primary_key=True)
    json = db.Column(db.Text())
    survey_form_id = db.Column(db.Integer(), db.ForeignKey('survey_form.id'))
    survey_form = relationship("SurveyForm")
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'json': self.json,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'survey': self.survey_form.to_dict()
        }

    def to_dict_simple(self):
        return {
            'id': self.id,
            'json': self.json,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'survey_form_id': self.survey_form_id
        }