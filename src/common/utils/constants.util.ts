export const ERROR_MESSAGES = {
  INVALID_REQUEST: "Invalid request",
  NOT_FOUND: "Not found",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  BAD_REQUEST: "Bad request",
  INVALID_REQUEST_BODY: "Invalid request body",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  SERVICE_UNAVAILABLE:
    "Notification service is unreachable. Please try again later.",
  ERROR: "Error occurred",
  UNEXPECTED_ERROR: "An unexpected error occurred",
  REQUESTED: "A request for the same action already exists.",
  TODO_NOT_FOUND: "Todos not found",
  TODO_DUEDATE: "The due date has already passed for action",
  TODO_STARTDATE:
    "You cannot perform this action because the start date has not started",
  TODO_ARCHIVED: "todo is archived",
  TODO_NOT_INCOMPLETE: "you can not edit field beacuse event is not incomplete",
  PROVIDE_ONE_USERID_IN_QUERY: 'Please provide userid in query param',
  USERID_INVALID: 'Invalid UUID',
  TODO_NOTFOUND: 'Todo not found'
};

export const SUCCESS_MESSAGES = {
  TODO_CREATED: "Todo Created",
  TODO_LIST: "Todo List fetched successfully",
  TODO_UPDATE: "Todo Updated Sucessfully",
  TODO_BYID: "TODO get by Id",
  TODO_DELETE: 'Todo delete successfully',
  TODO_CREATED_SUCCESSFULLY: (assigned_by, todo_id) => `Todo item created successfully by ${assigned_by}  with ID: ${todo_id}`,
  TODO_FETCHED_SUCCESSFULLY: `Successfully fetched todos list`,
  TODO_UPDATED_SUCCESSFULLY: (id) => `Todo with ID ${id} updated successfully `,
  TODO_FETCHED_WITH_ID: (todo_id) => `Fetched Todo with ID ${todo_id} successfully`,
  TODO_DELETED: (todo_id) => `Todo deleted with ID ${todo_id} successfully `
};

export const API_ID = {
  CREATE_TODO: "api.todo.create",
  LIST_TODO: "api.todo.list",
  GET_TODO: "api.todo.get",
  UPDATE_TODO: "api.todo.update",
  DELETE_TODO: "api.todo.delete",
};
