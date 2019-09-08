from flask_restplus import Resource, fields
from . import ns


@ns.route('/list')
class SurveyList(Resource):
    def get(self):
        pass
