from surveyapp import repositories, extensions


def get_list(owner_id, offset, size, q, sort_name, sort_order, status, visible):
    # validate number fields
    try:
        if owner_id:
            owner_id = int(owner_id)
        offset = int(offset)
        size = int(size)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params integer field"
        )
    # validate other fields
    if sort_name not in ["name", "created_at"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'sortName'"
        )
    if sort_order not in ["desc", "asc"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'sortOrder'"
        )
    if status not in ["all", "draft", "open", "close"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'status'"
        )
    if status == "all":
        status = ["DRAFT", "OPEN", "CLOSE"]
    else:
        status = [str.upper(status)]

    if visible not in ["all", "public", "protected"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'visible'"
        )
    if visible == "all":
        visible = [True, False]
    elif visible == "public":
        visible = [True]
    else:
        visible = [False]

    return repositories.survey_form.get_list_survey(
        owner_id, offset, size, q,sort_name, sort_order, status, visible
    )
