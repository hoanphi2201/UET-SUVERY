from surveyapp import models
from sqlalchemy import or_


def create_user(**kwargs):
    try:
        user = models.User(**kwargs)
        models.db.session.add(user)
        models.db.session.commit()
        return user
    except:
        return None


def find_user_by_username_or_email_ignore_case(username='', email=''):
    user = models.User.query.filter(
        or_(
            models.User.username.ilike(username),
            models.User.email.ilike(email)
        )
    ).first()
    return user