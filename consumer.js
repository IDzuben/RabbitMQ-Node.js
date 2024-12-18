const amqp = require('amqplib');

async function receiveMessage() {
    const queue = 'student.queue';

    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost');
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });

        console.log('[Consumer] Очікування повідомлень...');
        channel.consume(queue, (msg) => {
            if (msg) {
                console.log(`[Consumer] Отримано повідомлення: ${msg.content.toString()}`);
                channel.ack(msg);
            } else {
                console.log('[Consumer] Черга пуста.');
            }
        });
    } catch (error) {
        console.error('[Consumer] Помилка:', error);
    }
}

receiveMessage();
