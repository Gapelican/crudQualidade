import { NextApiRequest, NextApiResponse } from "next";
import { todoController } from "@server/controller/todo";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "PUT") {
    todoController.toggleDone(request, response);
    return;
  }

  response.status(405).json({
    error: {
      message: "Method not allowed",
    },
  });
}

// localhost:3000/api/todos/d5e0f4db-8f5e-4179-9719-6d02b5c7407f/toggle-done