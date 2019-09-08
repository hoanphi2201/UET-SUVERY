from flask_restplus import Resource, fields
from . import ns


@ns.route('/<int:survey_id>')
class Survey(Resource):
    def get(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass
