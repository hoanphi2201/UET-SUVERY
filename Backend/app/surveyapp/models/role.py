# coding=utf-8
import logging
from uuid import uuid4
from datetime import datetime
from sqlalchemy.orm import relationship
from surveyapp.models import db, TimestampMixin

__author__ = 'Ductt'
_logger = logging.getLogger(__name__)

role_function_table = db.Table(
    'role_function',
    db.Model.metadata,
    db.Column('role_id', db.Integer, db.ForeignKey('role.id', ondelete='CASCADE')),
    db.Column('function_id', db.Integer, db.ForeignKey('function.id', ondelete='CASCADE'))
)


class Role(db.Model, TimestampMixin):
    __tablename__ = 'role'

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text(), nullable=True)
    function = relationship("Function", secondary=role_function_table)

    def get_permission(self):
        results = []
        if len(self.function) > 0:
            for f in self.function:
                results.append(f"{f.name}")
        return {
            'key': self.name,
            'permissions': results
        }

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'functions': [f.id for f in self.function],
            'created_at': self.created_at.__str__(),
            'updated_at': self.updated_at.__str__()
        }

