'use strict'
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: `${process.env.ELASTIC_LOG_URL}` });
const fs = require('fs');

var linesArray = fs.readFileSync('/k6/mnt/results.json', 'utf8').split('\n');
var bulkData = [];

var indexData = { index: { _index: `${process.env.ELASTIC_LOG_INDEX}` } };

linesArray.forEach(function(line) {
  if (/^\{.+\}$/.test(line)) {
    var lineData = JSON.parse(line);
    bulkData.push(indexData);
    bulkData.push(lineData);
  }
});

async function run () {
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body: bulkData
  });

  if (bulkResponse.errors) {
    console.log(bulkResponse);
    process.exit(1);
  } else {
    console.log(`Indexed ${linesArray.length} documents to ${process.env.ELASTIC_LOG_URL}/${process.env.ELASTIC_LOG_INDEX}`);
  }
}

run().catch(console.log)

