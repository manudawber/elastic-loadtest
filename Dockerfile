FROM loadimpact/k6

RUN mkdir /k6/ /k6/log/
COPY ./script.js /k6/script.js
COPY ./log.js /k6/log/log.js
WORKDIR /k6/log
RUN apk add nodejs && npm install @elastic/elasticsearch
WORKDIR /k6/

ENTRYPOINT k6 --out json=/k6/mnt/results.json run /k6/script.js && node /k6/log/log.js 
