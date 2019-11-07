from surveyapp import repositories, extensions


def get_list_answer(survey_form_id, offset, size, order_by):
    # validate number fields
    try:
        offset = int(offset)
        size = int(size)
    except ValueError:
        raise extensions.exceptions.BadRequestException(
            message="Invalid params integer field"
        )
    # validate other fields
    if order_by not in ["created_at", "-created_at"]:
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
    return repositories.survey_answer.get_list_survey_answer(
        survey_form_id, offset, size, sort_name, sort_order
    )
