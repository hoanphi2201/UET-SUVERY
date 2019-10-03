from surveyapp import repositories, extensions


def get_list(owner_id, page, page_size, q, order_by):
    # validate number fields
    try:
        page = int(page)
        page_size = int(page_size)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params integer field"
        )
    # validate other fields
    if order_by not in ["name", "-name", "created_at", "-created_at", "updated_at", "-updated_at"]:
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
    return repositories.survey_form.get_list_survey(
        owner_id, page, page_size, q, sort_name, sort_order
    )
