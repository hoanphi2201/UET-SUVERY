# coding=utf-8
import logging
from uuid import uuid4
from surveyapp.models import db, TimestampMixin


__author__ = 'Ductt'
_logger = logging.getLogger(__name__)


class Function(db.Model, TimestampMixin):
    __tablename__ = 'function'

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text(), nullable=True)
