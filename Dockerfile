FROM loadimpact/k6

RUN mkdir /k6/ /k6/log/
COPY ./script.js /k6/script.js
COPY ./log.js /k6/log/log.js
WORKDIR /k6/log
RUN apk add nodejs && npm install @elastic/elasticsearch
WORKDIR /k6/
