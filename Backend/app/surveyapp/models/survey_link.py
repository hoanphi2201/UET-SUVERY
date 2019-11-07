from . import db, TimestampMixin
from sqlalchemy.orm import relationship
from uuid import uuid4


class SurveyLink(db.Model, TimestampMixin):
    __tablename__ = 'survey_link'

    def __init__(self, **kwargs):
        if not kwargs.get('id'):
            setattr(self, 'id', uuid4().hex)
        self.update_attr(**kwargs)

    id = db.Column(db.String(255), primary_key=True)
    is_active = db.Column(db.Boolean(), default=True)
    survey_form_id = db.Column(db.String(255), db.ForeignKey('survey_form.id'))
    survey_form = relationship("SurveyForm")
    survey_answers = relationship("SurveyAnswer", cascade="save-update, merge, delete")
    count_response = db.Column(db.Integer, default=0)

    def update_attr(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)