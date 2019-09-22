from surveyapp import repositories, extensions


def get_list(owner_id, offset, size, name, order_by, status):
    # validate number fields
    try:
        offset = int(offset)
        size = int(size)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params integer field"
        )
    # validate other fields
    if order_by not in ["name", "-name", "created_at", "-created_at"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'order_by'"
        )
    else:
        if order_by[0] == "-":
            sort_order = "desc"
            sort_name = order_by[1:]
        else:
            sort_order = "asc"
            sort_name = order_by

    if status not in ["all", "draft", "open", "close"]:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params 'status'"
        )
    if status == "all":
        status = ["DRAFT", "OPEN", "CLOSE"]
    else:
        status = [str.upper(status)]

    return repositories.survey_form.get_list_survey(
        owner_id, offset, size, name, sort_name, sort_order, status
    )
