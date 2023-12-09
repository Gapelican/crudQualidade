import { todoRepository } from "@server/repository/todo";
import { z as schema } from "zod";
import { NextApiRequest, NextApiResponse } from "next";
import { HttpNotFoundError } from "@server/infra/erros";

async function get(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query;
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    res.status(400).json({
      error: {
        message: "`page` must be a number",
      },
    });
    return;
  }

  if (query.limit && isNaN(limit)) {
    res.status(400).json({
      error: {
        message: "`limit` must be a number",
      },
    });
    return;
  }

  const output = await todoRepository.get({
    page: page,
    limit: limit,
  });

  res.status(200).json({
    total: output.total,
    pages: output.pages,
    todos: output.todos,
  });
}

const TodoCreateBodySchema = schema.object({
  content: schema.string(),
});
async function create(req: NextApiRequest, res: NextApiResponse) {
  // fail fast validations
  const body = TodoCreateBodySchema.safeParse(req.body);
  // Type Narrowing
  if (!body.success) {
    res.status(400).json({
      error: {
        message: "You need to provide a content to create a TODO!",
        description: body.error.issues,
      },
    });
    return;
  }
  // Here we have the data!
  try {
    const createdTodo = await todoRepository.createByContent(body.data.content);
    res.status(201).json({
      todo: createdTodo,
    });
  } catch {
    res.status(400).json({
      error: {
        message: "Failed to create TODO",
      },
    });
  }
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
  const todoId = req.query.id;

  if (!todoId || typeof todoId !== "string") {
    res.status(400).json({
      error: {
        message: "You must to provide a string ID",
      },
    });
    return;
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(todoId);

    res.status(200).json({
      todo: updatedTodo,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({
        error: {
          message: error.message,
        },
      });
    }
  }
}

async function deleteById(req: NextApiRequest, res: NextApiResponse) {
  // TODO validate query schema
  const QuerySchema = schema.object({
    id: schema.string().uuid().min(1),
  });

  // Fail Fast
  const parsedQuery = QuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return res.status(400).json({
      error: {
        message: `You must to provide a valid id`,
      },
    });
  }

  try {
    const todoId = parsedQuery.data.id;
    await todoRepository.deleteById(todoId);
    res.status(204).end();
  } catch (error) {
    if (error instanceof HttpNotFoundError) {
      res.status(error.status).json({
        error: {
          message: error.message,
        },
      });
    }
    res.status(500).json({
      error: {
        message: `Internal server error`,
      },
    });
  }
}

export const todoController = {
  get,
  create,
  toggleDone,
  deleteById,
};
