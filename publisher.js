const amqp = require('amqplib');

async function sendMessage() {
    const queue = 'student.queue';
    const message = `Hello, RabbitMQ! Timestamp: ${new Date().toISOString()}`;

    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(message));

        console.log(`[Publisher] Повідомлення відправлено: ${message}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('[Publisher] Помилка:', error);
    }
}

sendMessage();
