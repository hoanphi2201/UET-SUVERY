from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required
from surveyapp import repositories, extensions
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import SUBSCRIBE_LINK_SURVEY_ME
from .survey import survey_model
from . import ns

survey_link_subscribe_response = ns.model(
    name='Survey Link Response',
    model={
        'link': fields.String()
    }
)


@ns.route('/<string:survey_id>/subscribeLink')
class SurveyLink(Resource):
    @ns.marshal_with(survey_link_subscribe_response)
    @jwt_required
    @function_required(SUBSCRIBE_LINK_SURVEY_ME)
    def get(self, survey_id):
        survey = repositories.survey_form.find_survey_by_id(survey_id=survey_id)
        if not survey:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey"
            )
        link = repositories.survey_form.create_link(survey_id)
        if link:
            return {
                'link': link
            }


@ns.route('/<string:survey_link>')
class SurveyFromLink(Resource):
    @ns.marshal_with(survey_model)
    def get(self, survey_link):
        survey = repositories.survey_form.find_survey_by_survey_link(survey_link)
        if not survey:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey"
            )
        return survey
