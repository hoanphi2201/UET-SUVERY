import re

REGEX_EMAIL = r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
REGEX_USERNAME = ''
REGEX_PASSWORD = ''


def validate_email(value=''):
    return True


def validate_username(value=''):
    return True


def validate_password(value=''):
    return True
