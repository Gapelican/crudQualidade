import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface todoControllerGetParams {
  page: number;
}

async function get(params: todoControllerGetParams) {
  return todoRepository.get({
    page: params.page,
    limit: 2,
  });
}

function filterTodosByContent<Todo>(
  search: string,
  todos: Array<Todo & { content: string }>
): Array<Todo> {
  const homeTodos = todos.filter((todo) => {
    const searchNormalized = search.toLowerCase();
    const contentNormalized = todo.content.toLowerCase();
    return contentNormalized.includes(searchNormalized);
  });

  return homeTodos;
}

interface TodoControllerCreateParams {
  content?: string;
  onError: (customMessage?: string) => void;
  onSuccess: (todo: Todo) => void;
}

function create({ content, onSuccess, onError }: TodoControllerCreateParams) {
  // Fail Fast
  // se não tiver o content
  const parsedParams = schema.string().min(1).safeParse(content);
  if (!parsedParams.success) {
    onError("Você precisa prover um conteúdo!");
    return;
  }

  todoRepository
    .createByContent(parsedParams.data)
    .then((newTodo) => {
      onSuccess(newTodo);
    })
    .catch(() => {
      onError();
    });
}

export const todoController = {
  get,
  filterTodosByContent,
  create,
};
