const amqp = require('amqplib');

const queue = 'student.queue';
const testMessage = 'Test Message';

describe('RabbitMQ Integration Test', () => {
    let connection;
    let channel;

    beforeAll(async () => {
        // Підключення до RabbitMQ перед тестами
        connection = await amqp.connect('amqp://guest:guest@localhost');
        channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
    });

    afterAll(async () => {
        // Закриття з'єднання після тестів
        await channel.close();
        await connection.close();
    });

    test('Publisher should send a message to the queue', async () => {
        await channel.sendToQueue(queue, Buffer.from(testMessage));
        console.log('[Test] Повідомлення відправлено');
        // Успішне виконання цього тесту означає, що відправлення працює
    });

    test('Consumer should receive a message from the queue', async () => {
        const receivedMessages = [];
        await new Promise((resolve) => {
            channel.consume(queue, (msg) => {
                if (msg) {
                    receivedMessages.push(msg.content.toString());
                    channel.ack(msg);
                    resolve();
                }
            });
        });

        expect(receivedMessages).toContain(testMessage);
        console.log('[Test] Повідомлення отримано');
    });
});
