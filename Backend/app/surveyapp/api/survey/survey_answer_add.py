from flask_restplus import Resource, fields, Namespace
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from surveyapp import repositories, extensions, services
from surveyapp.helpers.decorators import function_required
from surveyapp.constants.function import VIEW_SURVEY_ME
from . import ns

survey_answer_add_request = ns.model(
    name='Survey Answer Add Request',
    model={
        'link': fields.String(required=True),
        'answer': fields.String(required=True),
    }
)

survey_answer_add_response = ns.model(
    name='Survey Answer Add Response',
    model={
        'created': fields.Boolean()
    }
)

survey_answer_simple = ns.model(
    name='Survey Answer Simple',
    model={
        'id': fields.String(),
        'answer': fields.String(),
        'user_id': fields.String(),
        'created_at': fields.DateTime(),
        'survey_form_id': fields.String()
    }
)

survey_answer_list_response = ns.model(
    name="Survey Answer List",
    model={
        'total': fields.Integer,
        'data': fields.List(fields.Nested(survey_answer_simple))
    }
)


@ns.route('/<string:survey_id>/answers')
class SurveyAnswerAdd(Resource):
    @ns.expect(survey_answer_add_request, validate=True)
    @ns.marshal_with(survey_answer_add_response)
    def post(self, survey_id):
        data = request.json
        survey = repositories.survey_form.find_survey_by_id(survey_id)
        if not survey:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey"
            )
        user_id = get_jwt_identity()
        if not user_id or user_id not in survey.invited_user_id:
            data.append({
                "user_id": None,
                "survey_form_id": survey_id
            })
        else:
            data.append({
                "user_id": user_id,
                "survey_form_id": survey_id
            })
        repositories.survey_answer.add_survey_answer(**data)
        return {
            "created": True
        }

    @ns.doc(
        params={
            'size': 'page size',
            'offset': 'page number',
            'order_by': 'Sort type',
        }
    )
    @ns.marshal_with(survey_answer_list_response)
    @jwt_required
    @function_required(VIEW_SURVEY_ME)
    def get(self, survey_id):
        params = request.args
        offset = params.get('offset', 1)
        size = params.get('size', 10)
        order_by = params.get('order_by', 'created_at')
        result = services.survey.get_list_answer(
            survey_id, offset, size, order_by
        )
        return result
