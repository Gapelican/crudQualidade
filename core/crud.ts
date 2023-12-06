/* eslint-disable no-console */
import fs from "fs"; // ES6
import { randomUUID } from "crypto";
const DB_FILE_PATH = "./core/db";

// console.log("[ *** ==> CRUD <== *** ]");

type randomUUID = string;

interface Todo {
  id: randomUUID;
  date: string;
  content: string;
  done: boolean;
}

export function create(content: string): Todo {
  const todo: Todo = {
    id: randomUUID(),
    date: new Date().toISOString(),
    content: content,
    done: false,
  };

  const todos: Array<Todo> = [...read(), todo];

  // salvar o content no sistema
  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );
  return todo;
}

export function read(): Array<Todo> {
  const dbString = fs.readFileSync(DB_FILE_PATH, "utf-8");
  const db = JSON.parse(dbString || "{}");
  if (!db.todos) {
    return [];
  }
  return db.todos;
}

export function update(id: randomUUID, partialTodo: Partial<Todo>): Todo {
  let updateTodo;
  const todos = read();
  todos.forEach((currentTodo) => {
    const isToUpdate = currentTodo.id === id;
    if (isToUpdate) {
      updateTodo = Object.assign(currentTodo, partialTodo);
    }
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos,
      },
      null,
      2
    )
  );

  if (!updateTodo) {
    throw new Error("Please, provide another ID!");
  }

  return updateTodo;
}

export function updateContentById(id: randomUUID, content: string): Todo {
  return update(id, {
    content,
  });
}

export function deleteById(id: randomUUID) {
  const todos = read();

  const todosWithoutOne = todos.filter((todo) => {
    if (id === todo.id) {
      return false;
    }

    return true;
  });

  fs.writeFileSync(
    DB_FILE_PATH,
    JSON.stringify(
      {
        todos: todosWithoutOne,
      },
      null,
      2
    )
  );
}

function CLEAR_BD() {
  fs.writeFileSync(DB_FILE_PATH, "");
}

// [SIMULATION]
// CLEAR_BD();
// create("Primeira Todo");
// const secondTodo = create("Segunda Todo");
// deleteById(secondTodo.id);
// const terceiraTodo = create("Terceira Todo");
// // update(terceiraTodo.id, {
// //   content: "Terceira Todo com novo content!",
// //   done: true,
// // });
// updateContentById(terceiraTodo.id, "XABLAUUUUUUUUUUUUUUU");
// console.log(read());

// create("Ir ao parque");
// create("Levar o cachorro para passear");
// create("Jantar com a namorada às 20h");
