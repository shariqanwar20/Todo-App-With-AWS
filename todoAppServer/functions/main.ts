import { addTodo } from "./addTodo";
import { deleteTodo } from "./deleteTodo";
import { getTodo } from "./getTodo";
import { updateTodo } from "./updateTodo";

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    title: string;
    id: string;
    todo: Todo;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "getTodos":
      return await getTodo();
    case "addTodo":
      return await addTodo(event.arguments.title);
    case "deleteTodo":
      return await deleteTodo(event.arguments.id);
    case "updateTodo":
      return await updateTodo(event.arguments.todo);
    default:
      return null;
  }
};
