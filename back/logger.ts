import { createLogger, transports, format, Logger } from "winston";
import LokiTransport from "winston-loki";

let logger: Logger;

const initializeLogger = () => {
  if (logger) {
    return;
  }
  const t: any[] = [];

  if (Bun.env.NODE_ENV !== "production") {
    t.push(
      new transports.Console({
        format: format.combine(format.simple(), format.colorize()),
      }),
    );
  }
  if (Bun.env.LOKI_HOST) {
    t.push(
      new LokiTransport({
        basicAuth: Bun.env.LOKI_BASIC_AUTH,
        host: Bun.env.LOKI_HOST,
        labels: { app: Bun.env.APP_NAME },
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err),
      }),
    );
  }
  logger = createLogger({
    transports: t,
  });
};

initializeLogger();

// @ts-ignore
export default logger;
