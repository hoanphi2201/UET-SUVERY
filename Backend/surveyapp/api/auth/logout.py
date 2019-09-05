from flask_restplus import Resource, fields
from datetime import datetime
from flask_jwt_extended import (
    jwt_refresh_token_required,
    get_raw_jwt
)
from surveyapp import models
from . import ns


logout_request = ns.model(
    name='Logout request',
    model={
        'refreshToken': fields.String(
            required=True
        )
    }
)

logout_response = ns.model(
    name='Logout response',
    model={
        'logout': fields.Boolean(),
    }
)


@ns.route('/logout')
class Logout(Resource):
    @jwt_refresh_token_required
    @ns.expect(logout_request, validate=True)
    @ns.marshal_with(logout_response)
    def post(self):
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
