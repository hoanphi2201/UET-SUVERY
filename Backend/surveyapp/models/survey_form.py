# coding=utf-8
import logging
from sqlalchemy.orm import relationship
from surveyapp.models import db, bcrypt, TimestampMixin


__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class SurveyForm(db.Model, TimestampMixin):
    __tablename__ = 'survey_form'

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    json = db.Column(db.Text())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    survey_answer = relationship("SurveyAnswer", cascade="save-update, merge, delete")
