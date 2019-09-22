from flask_restplus import Resource, fields
from flask_jwt_extended import (
    jwt_required,
)
from flask import request
from surveyapp import services, models, repositories, extensions
from . import ns

survey_model = ns.model(
    name='Survey Model',
    model=models.SurveyModel.survey_model
)

survey_edit_request = ns.model(
    name='Survey Edit Request',
    model=models.SurveyModel.survey_edit_model,
)

survey_edit_response = ns.model(
    name='Survey Edit Response',
    model={
        'updated': fields.Boolean()
    }
)

survey_delete_response = ns.model(
    name='Survey Delete Response',
    model={
        'deleted': fields.Boolean()
    }
)


@ns.route('/<string:survey_id>')
class Survey(Resource):
    @ns.marshal_with(survey_model)
    def get(self, survey_id):
        survey = repositories.survey_form.find_survey_by_id(survey_id=survey_id)
        if not survey:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey"
            )
        return survey.to_dict()

    @ns.expect(survey_edit_request, validate=True)
    @ns.marshal_with(survey_edit_response)
    def put(self, survey_id):
        data = request.json
        services.survey.survey_edit(survey_id, **data)
        return {
            'updated': True
        }

    @ns.marshal_with(survey_delete_response)
    @jwt_required
    def delete(self, survey_id):
        repositories.survey_form.delete_survey(survey_id=survey_id)
        return {
            'deleted': True
        }
