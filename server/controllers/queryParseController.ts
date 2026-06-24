import type { Request, Response, NextFunction } from 'express'
import OpenAI from 'openai'
import { zodTextFormat } from "openai/helpers/zod"
import { z } from "zod"

const openai = new OpenAI()

const StruturedQuery = z.object({
  userQuery: z.string(),
  title: z.string().nullable(),
  artist: z.string().nullable(),
  year: z.string().nullable()
})

const queryParse = async (req: Request, res: Response, next:NextFunction) => {
  const { query } = req.body

  try {
    const response = await openai.responses.parse({
      model: "gpt-4o",
      input: [
        {role: "system", content: "Extract song metadata from the user's query. If a field is not mentioned, return null."},
        {
          role: "user",
          content: query
        }
      ],
      text: {
        format: zodTextFormat(StruturedQuery, "structured_query")
      }
    })

    const userQuery = response.output_parsed
    res.locals.parsedQuery = userQuery
    return next()
  } catch(err) {
    next(err)
  }
}

export default queryParse