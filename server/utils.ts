import { AsyncLocalStorage } from "node:async_hooks";

const requestContext = new AsyncLocalStorage<{ requestId: string }>();

export function runWithRequestContext(requestId: string, fn: () => void) {
  requestContext.run({ requestId }, fn);
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const requestId = requestContext.getStore()?.requestId;
  const requestLabel = requestId ? ` [req:${requestId}]` : "";

  console.log(`${formattedTime} [${source}]${requestLabel} ${message}`);
}
