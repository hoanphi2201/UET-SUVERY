# coding=utf-8
import logging
from uuid import uuid4
from sqlalchemy.orm import relationship
from surveyapp.models import db, TimestampMixin


__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class SurveyAnswer(db.Model, TimestampMixin):
    __tablename__ = 'survey_answer'

    def __init__(self, **kwargs):
        if not kwargs.get('id'):
            setattr(self, 'id', uuid4().hex)
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.String(255), primary_key=True)
    answer = db.Column(db.JSON())
    survey_link_id = db.Column(db.String(255), db.ForeignKey('survey_link.id'))
    survey_link = relationship("SurveyLink")
    user_id = db.Column(db.String(255), db.ForeignKey('user.id'), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'answer': self.answer,
            'created_at': self.created_at,
            'survey': self.survey_form.to_dict()
        }

    def to_dict_simple(self):
        return {
            'id': self.id,
            'answer': self.answer,
            'created_at': self.created_at,
            'survey_form_id': self.survey_form_id
        }