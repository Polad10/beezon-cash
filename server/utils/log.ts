import { LogLevel } from '../models/log.model'

export async function log(level: LogLevel, message: String) {
  const logData = {
    level: level.toString(),
    message: message,
  }

  const log = new Log(logData)

  await log.save()
}
