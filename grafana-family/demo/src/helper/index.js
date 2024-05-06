const { context, propagation } = require("@opentelemetry/api");

const tracer = require("../utils/tracer.js");
const logger = require("../utils/logger.js");

const startSpan = ({ req, res }, callback) => {
  let activeContext;
  try {
    const input = JSON.parse(req.headers["trace-context"] ?? "{}");
    activeContext = propagation.extract(context.active(), input);
  } catch (err) {
    logger.error(err.toString());
  }
  tracer.startActiveSpan(
    req.path,
    { attributes: { "http.method": req.method, "http.path": req.path } },
    activeContext,
    async (span) => {
      await callback();
      span.setAttribute("http.status_code", res.statusCode);
      span.end();
    }
  );
};

module.exports = { startSpan };
