from flask_restplus import Resource, fields
from flask_jwt_extended import jwt_required
from . import ns
from surveyapp import repositories, extensions
from .survey import survey_model

survey_answer_response = ns.model(
    name="Survey Answer Response",
    model={
        'id': fields.Integer,
        'answer': fields.String(),
        'user_id': fields.String(),
        'created_at': fields.DateTime(),
        'survey': fields.Nested(survey_model)
    }
)

survey_answer_delete_response = ns.model(
    name='Survey Answer Delete Response',
    model={
        'deleted': fields.Boolean()
    }
)


@ns.route('/answers/<string:survey_answer_id>')
class SurveyAnswer(Resource):
    @ns.marshal_with(survey_answer_response)
    @jwt_required
    def get(self, survey_answer_id):
        survey_answer = repositories.survey_answer.find_survey_answer_by_id(
            survey_answer_id=survey_answer_id
        )
        if not survey_answer:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey answer"
            )
        return survey_answer.to_dict()

    @ns.marshal_with(survey_answer_delete_response)
    @jwt_required
    def delete(self, survey_answer_id):
        repositories.survey_answer.delete_survey_answer(
            survey_answer_id=survey_answer_id
        )
        return {
            'deleted': True
        }
