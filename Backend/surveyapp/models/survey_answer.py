# coding=utf-8
import logging
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
