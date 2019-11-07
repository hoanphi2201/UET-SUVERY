from surveyapp import models


def create_role(**kwargs):
    try:
        role = models.Role(**kwargs)
        models.db.session.add(role)
        models.db.session.commit()
        return role
    except:
        return None


def find_role_by_name_ignore_case(name=''):
    role = models.Role.query.filter(
            models.Role.name.ilike(name)
    ).first()
    return role


def find_function_by_id(f_id):
    function = models.Function.query.filter(
            models.Function.id == f_id
    ).first()
    return function


def find_role_by_id(role_id=''):
    role = models.Role.query.filter(
        models.Role.id == role_id
    ).first()
    return role or None


def delete_role_by_id(role_id):
    role = find_role_by_id(role_id=role_id)
    if role:
        models.db.session.delete(role)
        models.db.session.commit()
