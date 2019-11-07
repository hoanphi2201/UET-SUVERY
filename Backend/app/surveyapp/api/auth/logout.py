from flask_restplus import Resource, fields
from datetime import datetime
from flask_jwt_extended import (
    jwt_required,
    get_raw_jwt
)
from surveyapp import models
from . import ns

logout_response = ns.model(
    name='Logout response',
    model={
        'logout': fields.Boolean(),
    }
)


@ns.route('/logout')
class Logout(Resource):
    @jwt_required
    @ns.marshal_with(logout_response)
    def get(self):
        jti = get_raw_jwt()['jti']
        expired_at = get_raw_jwt()['exp']
        revoke = models.RevokedToken(
            jti=jti,
            expired_at=datetime.fromtimestamp(expired_at)
        )
        models.db.session.add(revoke)
        models.db.session.commit()
        return {
            'logout': True
        }
