# Introduction

Demonstrate distributed tracing based on [opentelemetry](https://opentelemetry.io/docs/) under microservice-based architecture

---

```sh
PORT=4000 SERVICE_NAME=service_01 JAEGER_ENDPOINT=http://172.19.59.123:14268/api/traces node index.js
PORT=5000 SERVICE_NAME=service_02 JAEGER_ENDPOINT=http://172.19.59.123:14268/api/traces node index.js
```

---

# Demo

![img](img/01.jpg)
![img](img/02.jpg)
![img](img/03.jpg)
![img](img/04.jpg)
