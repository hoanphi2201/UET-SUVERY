from surveyapp import repositories, extensions


def signin(username_or_email='', password=''):
    # validation
    if '@' in username_or_email:
        email = username_or_email
        username = ''
    else:
        username = username_or_email
        email = ''
    user = repositories.user.find_user_by_username_or_email_ignore_case(
        username=username,
        email=email
    )
    if not user or not user.check_password(password):
        raise extensions.exceptions.BadRequestException(
            message='Username or email or password invalid'
        )
    return user
