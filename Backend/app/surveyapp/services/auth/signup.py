from surveyapp import extensions, repositories


def signup(username='', email='', password='', **kwargs):
    if not username or not email or not password:
        raise extensions.exceptions.BadRequestException(
            message='Invalid data'
        )
    user_existed = repositories.user.find_user_by_username_or_email_ignore_case(
        username=username,
        email=email
    )
    if user_existed:
        raise extensions.exceptions.BadRequestException(
            message='Username or email existed'
        )
    user_created = repositories.user.create_user(
        username=username,
        email=email,
        password=password,
        role_id=2,
        **kwargs
    )
    if not user_created:
        return {
            'created': False
        }
    return {
        'created': True
    }
