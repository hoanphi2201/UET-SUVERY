# coding=utf-8
import logging

__author__ = 'Teko'
_logger = logging.getLogger(__name__)


def init_app(app, **kwargs):
    pass


from . import auth
from . import survey