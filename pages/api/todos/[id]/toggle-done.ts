import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  // eslint-disable-next-line no-console
  console.log(request.headers);
  response.status(200).json({ message: "Toggle Done!" });
}

// localhost:3000/api/todos/aef409d-9b8b-4c5e-928f-c48a4ad3f1f7/toggle-done
// Novo teste
