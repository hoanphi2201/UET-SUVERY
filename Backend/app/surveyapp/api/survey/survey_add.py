from flask_restplus import Resource, fields
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from flask import request
from surveyapp import models, services
from . import ns

survey_add_request = ns.model(
    name='Survey Add Request',
    model=models.SurveyModel.survey_add_model
)

survey_add_response = ns.model(
    name='Survey Add Response',
    model={
        'created': fields.Boolean()
    }
)


@ns.route('/')
class SurveyAdd(Resource):
    @jwt_required
    @ns.expect(survey_add_request, validate=True)
    @ns.marshal_with(survey_add_response)
    def post(self):
        owner_id = get_jwt_identity()
        new_survey = services.survey.survey_add(owner_id=owner_id, **request.json)
        if new_survey:
            return {
                'created': True
            }
        return {
            'created': False
        }
