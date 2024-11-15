import { LogLevel } from '../models/log.model'

export async function log(level: LogLevel, message: String, extra: Object | null = null) {
  const logData = {
    level: level.toString(),
    message: message,
    extra: extra,
  }

  const log = new Log(logData)

  await log.save()
}
