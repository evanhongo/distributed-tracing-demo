const os = require("os");
const {
  NodeTracerProvider,
  BatchSpanProcessor,
} = require("@opentelemetry/sdk-trace-node");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const {
  WinstonInstrumentation,
} = require("@opentelemetry/instrumentation-winston");
const { trace } = require("@opentelemetry/api");

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
    [SemanticResourceAttributes.HOST_NAME]: os.hostname(),
  }),
});

provider.addSpanProcessor(
  new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: process.env.JAEGER_ENDPOINT
    })
  )
);

provider.register();
const tracer = trace.getTracer("example-basic-tracer-node");

registerInstrumentations({
  provider,
  instrumentations: [
    new WinstonInstrumentation({
      // Optional hook to insert additional context to log metadata.
      // Called after trace context is injected to metadata.
      logHook: (span, record) => {
        record["resource.service.name"] =
          provider.resource.attributes["service.name"];
      },
    }),
    // other instrumentations
  ],
});

module.exports = tracer;
