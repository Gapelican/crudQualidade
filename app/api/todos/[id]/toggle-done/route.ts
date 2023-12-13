import { todoController } from "@server/controller/todo";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return todoController.toggleDone(request, params.id);
}
// import { NextApiRequest, NextApiResponse } from "next";
// import { todoController } from "@server/controller/todo";

// export default async function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   if (request.method === "PUT") {
//     await todoController.toggleDone(request, response);
//     return;
//   }

//   response.status(405).json({
//     error: {
//       message: "Method not allowed",
//     },
//   });
// }

// // localhost:3000/api/todos/d5e0f4db-8f5e-4179-9719-6d02b5c7407f/toggle-done
