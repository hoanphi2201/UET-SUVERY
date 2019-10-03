# coding=utf-8
import logging
from uuid import uuid4
from sqlalchemy.orm import relationship
from surveyapp.models import db, bcrypt, TimestampMixin

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class User(db.Model, TimestampMixin):
    __tablename__ = 'user'

    def __init__(self, **kwargs):
        if not kwargs.get('id'):
            setattr(self, 'id', uuid4().hex)
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.String(255), primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    fullname = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean(), default=True)
    password_hash = db.Column(db.String(255))
    link_survey = db.Column(db.ARRAY(db.String(255)), default=[])
    contact = db.Column(db.ARRAY(db.String(255)), default=[])
    survey_form = relationship('SurveyForm', cascade="save-update, merge, delete")
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    role = relationship("Role")

    @property
    def password(self):
        raise AttributeError('password: write-only field')

    @password.setter
    def password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def get_id(self):
        return self.id

    def to_dict(self):
        """
        Transform user obj into dict
        :return:
        """
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'fullname': self.fullname,
            'is_active': self.is_active,
            'created_at': self.created_at,
            'roles': self.role.get_permission(),
            'contact': self.contact
        }
