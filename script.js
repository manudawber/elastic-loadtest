import { check, sleep } from "k6"
import encoding from "k6/encoding";
import http from "k6/http";

const url = `${__ENV.ELASTIC_URL}`,
      index = `${__ENV.ELASTIC_INDEX}`,
      user = `${__ENV.ELASTIC_USER}`,
      passwd = `${__ENV.ELASTIC_PASSWD}`,
      payload = open("/k6/mnt/query.json");

export let options = {
    stages: [
        { duration: `${__ENV.TEST_RAMP_DURATION}`, target: `${__ENV.TEST_NUM_USERS}` },
        { duration: `${__ENV.TEST_DURATION}`, target: `${__ENV.TEST_NUM_USERS}`  },
    ]
};

export default function() {
    let endpoint = `${url}/${index}/_search`
    let params = {
        headers: {
            "Authorization": "Basic " + encoding.b64encode(`${user}:${passwd}`),
            "Content-Type": "application/json"
        }
    };
    let res = http.post(endpoint, payload, params);
    check(res, {
        "is status 200": (r) => r.status === 200
    });
    sleep(1);
};
