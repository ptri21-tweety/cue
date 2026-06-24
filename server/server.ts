import 'dotenv/config' // loads varibles immeaditatly
import express, { ErrorRequestHandler } from 'express'
import cors from 'cors'
import { ServerError } from './types'

// TODO: import controllers once names are confirmed
// queryParseController, embedQuery, queryPinecone, generateRecommendation, loggingMiddleware
import queryParse  from './controllers/queryParseController'


const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

app.post('/api/search', 
  queryParse,
  // embedQuery,
  // queryPinecone,
  // generateRecommendation,
  // loggingMiddleware,
  (req, res, next) => {
  res.status(200).json({
    songRecs: res.locals.recommendation
  })
})

const errorHandler: ErrorRequestHandler= (err, req, res, next) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: {err: 'An error occured'}
  }

  const errorObj: ServerError = {...defaultErr, ...err}

  console.log(errorObj.log)
  res.status(errorObj.status).json(errorObj.message)
}

app.use(errorHandler)

export default app

if (process.env.NODE_ENV !== 'test') {
  app.listen( PORT, () => console.log(`Server running on port: ${PORT}`))
}