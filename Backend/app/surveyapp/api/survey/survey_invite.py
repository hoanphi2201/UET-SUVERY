from flask_restplus import Resource, fields
from flask import request
from flask_jwt_extended import jwt_required
from surveyapp import repositories, extensions
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import INVITE_SURVEY_ME
from . import ns


survey_invite_request = ns.model(
    name='Survey Invite Request',
    model={
        'email_invite': fields.List(fields.String())
    }
)

survey_invite_response = ns.model(
    name='Survey Invite Response',
    model={
        'email_invite_success': fields.List(fields.String())
    }
)


@ns.route('/<string:survey_id>/invite')
class SurveyInvite(Resource):
    @ns.expect(survey_invite_request, validate=True)
    @ns.marshal_with(survey_invite_response)
    @jwt_required
    @function_required(INVITE_SURVEY_ME)
    def post(self, survey_id):
        survey = repositories.survey_form.find_survey_by_id(survey_id)
        if not survey:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey"
            )
        list_email_invite = request.json.get('email_invite')
        list_email_invite_success = []
        for email in list_email_invite:
            user = repositories.user.find_user_by_username_or_email_ignore_case(email=email)
            if not user or user.id in survey.invited_user_id:
                continue
            else:
                if email not in user.contact:
                    user.contact.append(email)
                survey.invited_user_id.append(user.id)
                list_email_invite_success.append(email)
        return {
            'email_invite_success': list_email_invite_success
        }
