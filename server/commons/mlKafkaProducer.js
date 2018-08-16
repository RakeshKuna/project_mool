'use strict'
var kafka = require('kafka-node')



export function pushlogsByKafka (message,topic) {
  const Producer = kafka.Producer;
  const host = process.env.KAFKA_HOST || 'localhost';
  const port = process.env.KAFKA_PORT || '2181';
  const client = new kafka.Client(`${host}:${port}`);
  let producer = new Producer(client);
  try {
    let payloads = [
      {topic: topic, messages: message, partition: 0,timestamp: Date.now()},
    ];

    producer.on('ready', () => {
      producer.send(payloads, (err, data) => {
        if (err) {
          console.log('Error while producing: ', err);
        } else {
        }
      });
    });

    producer.on('error',function(err){
      console.log('error from fafka server to produce.................', err);
    });


  } catch (e) {
    console.log('Kafka not installed')
  }
}
