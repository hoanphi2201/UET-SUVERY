from flask_restplus import Resource, fields, Namespace
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from surveyapp import repositories, extensions, services
from . import ns

survey_answer_add_request = ns.model(
    name='Survey Answer Add Request',
    model={
        'json': fields.String(required=True),
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
        'id': fields.Integer,
        'json': fields.String(),
        'user_id': fields.Integer,
        'created_at': fields.DateTime(),
        'survey_form_id': fields.Integer
    }
)

survey_answer_list_response = ns.model(
    name="Survey Answer List",
    model={
        'total': fields.Integer,
        'data': fields.List(fields.Nested(survey_answer_simple))
    }
)


@ns.route('/answers/<int:survey_form_id>')
class SurveyAnswerAdd(Resource):
    @ns.expect(survey_answer_add_request, validate=True)
    @ns.marshal_with(survey_answer_add_response)
    def post(self, survey_form_id):
        data = request.json
        survey = repositories.survey_form.find_survey_by_id(survey_form_id)
        if not survey:
            raise extensions.exceptions.NotFoundException(
                message="Not found survey"
            )
        if survey.is_visible:
            data.append({"user_id": None})
        else:
            user_id = get_jwt_identity()
            allow_id = [x.id for x in survey.respondents]
            if user_id not in allow_id:
                raise extensions.exceptions.ForbiddenException(
                    message="Permission denied"
                )
            else:
                data.append({"user_id": user_id})
        data.append({"survey_form_id": survey_form_id})
        # call service
        return {
            "created": True
        }

    @ns.doc(
        params={
            'size': 'page size',
            'offset': 'page number',
            'sortOrder': 'Sort type',
        }
    )
    @ns.marshal_with(survey_answer_list_response)
    def get(self, survey_form_id):
        params = request.args
        offset = params.get('offset', 1)
        size = params.get('size', 10)
        sort_order = params.get('sortOrder', 'desc')
        result = services.survey.get_list_answer(
            survey_form_id, offset, size, sort_order
        )
        return result
