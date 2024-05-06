const express = require("express");
const { context, propagation } = require("@opentelemetry/api");

const { startSpan } = require("./helper");
const logger = require("./utils/logger.js");
const sleep = require("./utils/sleep.js");

const main = () => {
  const app = express();
  app.get("/ping", (req, res) => {
    startSpan({ req, res }, async () => {
      // business logic
      await sleep(2000);
      const output = {};
      propagation.inject(context.active(), output);
      await fetch("http://app2:5000/ping2", {
        headers: { "trace-context": JSON.stringify(output) },
      });
      logger.info("ping");
      res.send("pong");
    });
  });

  app.get("/ping2", (req, res) => {
    startSpan({ req, res }, async () => {
      // business logic
      await sleep(3000);
      logger.info("ping2");
      res.status(400).send("pong2");
    });
  });

  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    logger.info(`Server is listening at port ${PORT}`);
  });
};

main();
