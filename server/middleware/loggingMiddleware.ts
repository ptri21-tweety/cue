import type { Request, Response, NextFunction } from 'express'
import { promises as fs } from 'fs'
import path from 'path'

const loggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { parsedQuery, retrievedSongs, recommendation } = res.locals
  const logEntry = {
    timesStamp: new Date().toISOString(),
    parsedQuery,
    retrievedSongs,
    recommendation
  }

  const logPath = path.join(process.cwd(), 'logs', 'logs.jsonl')

  try {
    await fs.mkdir(path.dirname(logPath), { recursive: true })

    await fs.appendFile(logPath, JSON.stringify(logEntry) + '\n')

    return next()
  } catch (err) {
    next(err)
  }
}

export default loggingMiddleware