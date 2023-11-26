// const { Kafka, Partitioners } = require('kafkajs');

// const kafka = new Kafka({
//     brokers: ['localhost:9092']
// });

// const producer = kafka.producer({
//     createPartitioner: Partitioners.LegacyPartitioner
// });

// const msg = {
//     name: 'chori chori dil tera churainge',
// };


// async function start() {
//     await producer.connect();
//     producer.on('producer.connect', () => {
//         console.log('--------producer start');
//     })
//     await producer.send({
//         topic: 'noti',
//         messages: [
//             {
//                 key: 'notification',
//                 value: JSON.stringify(msg)
//             }
//         ]
//     });
// }

// start();


const { kafka } = require("./client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  const producer = kafka.producer();

  console.log("Connecting Producer");
  await producer.connect();
  console.log("Producer Connected Successfully");

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async function (line) {
    const [riderName, location] = line.split(" ");
    await producer.send({
      topic: "rider-updates",
      messages: [
        {
          partition: location.toLowerCase() === "north" ? 0 : 1,
          key: "location-update",
          value: JSON.stringify({ name: riderName, location }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();
