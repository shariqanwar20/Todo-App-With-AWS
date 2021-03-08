import { addTodo } from "./addTodo";
import { deleteTodo } from "./deleteTodo";
import { getTodo } from "./getTodo";
import { updateTodo } from "./updateTodo";

type AddTodo = {
  title: string;
  userToken: string;
}

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
    addTodo: AddTodo;
    token: string;
    id: string;
    todo: Todo;
  };
};

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "getTodos":
      return await getTodo(event.arguments.token);
    case "addTodo":
      console.log("ADD tOdo props ==> ", event.arguments.addTodo);
      return await addTodo(event.arguments.addTodo);
    case "deleteTodo":
      return await deleteTodo(event.arguments.id);
    case "updateTodo":
      console.log("update tOdo props ==> ", event.arguments.todo);
      return await updateTodo(event.arguments.todo);
    default:
      return null;
  }
};
