export async function GET(request: Request) {
  return new Response(`Hello, ${request}`, {
    status: 200,
  });
}

/*
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  response.status(200).json({ message: "Olá mundo!" });
}

*/
