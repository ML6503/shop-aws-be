import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import type {  Handler } from "aws-lambda"
// import { loggerWrapper } from "./logger"

export const middyfy = (handler:  Handler) => {
  // return middy(loggerWrapper(handler)).use(middyJsonBodyParser())
  return middy(handler).use(middyJsonBodyParser());
}
