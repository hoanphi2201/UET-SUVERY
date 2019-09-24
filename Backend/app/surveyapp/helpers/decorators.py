from flask_jwt_extended import get_jwt_identity
from surveyapp import repositories, extensions
from surveyapp.constants.function import *
from functools import wraps

function_no_deep = [ADD_USER, EDIT_USER, VIEW_ALL_USER, DELETE_USER, ADD_SURVEY, ADD_ROLE, EDIT_ROLE, VIEW_ALL_ROLE,
                    DELETE_ROLE]

function_deep_survey_form_id = [VIEW_SURVEY_ME, EDIT_SURVEY_ME, DELETE_SURVEY_ME, STATISTIC_SURVEY_ME, INVITE_SURVEY_ME,
                                SUBSCRIBE_LINK_SURVEY_ME]


def permission_denied():
    raise extensions.exceptions.ForbiddenException(message="Permission denied")


def function_required(function_name):
    def inner_function(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = repositories.user.find_user_by_id(
                user_id=user_id)
            if not (user and user.role and user.role.function):
                permission_denied()

            current_function = [f.name for f in user.role.function]
            if function_name not in current_function:
                permission_denied()

            elif function_name in function_no_deep:
                return function(*args, **kwargs)
            elif function_name in function_deep_survey_form_id:
                survey_id = kwargs.get('survey_id')
                if not survey_id or survey_id not in [s.id for s in user.survey_form]:
                    permission_denied()
                return function(*args, **kwargs)
        return wrapper
    return inner_function
