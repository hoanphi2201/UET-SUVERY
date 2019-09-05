# coding=utf-8
import logging
from sqlalchemy.orm import relationship
from surveyapp.models import db, bcrypt, TimestampMixin

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class User(db.Model, TimestampMixin):
    __tablename__ = 'user'

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    username = db.Column(db.String(255), nullable=False, unique=True)
    fullname = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean(), default=True)
    is_admin = db.Column(db.Boolean(), default=False)
    password_hash = db.Column(db.String(255))
    image = db.Column(db.Text(), nullable=True)
    survey_form = relationship('SurveyForm', cascade="save-update, merge, delete")

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
            'ia_active': self.is_active,
            'is_admin': self.is_admin
        }
