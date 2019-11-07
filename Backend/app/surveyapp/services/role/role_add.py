from surveyapp import extensions, repositories


def role_add(name='', description='', functions=None, **kwargs):
    exist_role = repositories.role.find_role_by_name_ignore_case(
        name=name
    )
    if exist_role:
        raise extensions.exceptions.BadRequestException(
            message="Role is existed"
        )
    new_role = repositories.role.create_role(name=name, description=description, **kwargs)
    if new_role:
        for function_id in functions:
            func = repositories.role.find_function_by_id(function_id)
            if func:
                new_role.function.append(func)
        return new_role
