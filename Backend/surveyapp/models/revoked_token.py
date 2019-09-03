from . import db


class RevokedToken(db.Model):
    __tablename__ = 'revoked_token'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    jti = db.Column(db.String(255, convert_unicode=True), nullable=False)

    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)
