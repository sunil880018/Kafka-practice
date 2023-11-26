// const { Kafka } = require('kafkajs');

// const kafka = new Kafka({
//     brokers: ['localhost:9092']
// });
// const consumer = kafka.consumer({ groupId: 'group-1' });

// async function start() {
//     await consumer.connect();
//     // await consumer.subscribe({ topic: 'noti', fromBeginning: true });
//     await consumer.subscribe({ topic: 'noti'});

//     await consumer.run({
//         eachMessage: async ({ topic, partition, message, heartbeat }) => {
//             console.log({
//                 value: message.value.toString()
//             });
//             await heartbeat();
//         }
//     });
// }

// start();


const { kafka } = require("./client");
const group = process.argv[2];

async function init() {
  const consumer = kafka.consumer({ groupId: group });
  await consumer.connect();

  await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
      console.log(
        `${group}: [${topic}]: PART:${partition}:`,
        message.value.toString()
      );
    },
  });
}

init();
