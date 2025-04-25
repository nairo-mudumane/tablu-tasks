/* eslint-disable no-console */

import * as amqp from 'amqplib';

import { ENV } from './dotenv';

type OnMessage = (message: string) => Promise<void>;
type Connection = amqp.ChannelModel;
type Channel = amqp.Channel;

export class RabbitMQClient {
  private async connect() {
    try {
      console.log('connecting message broker...');
      const connection = await amqp.connect({
        hostname: ENV.RABBITMQ_HOST,
        port: Number(ENV.RABBITMQ_PORT),
        username: ENV.RABBITMQ_USER,
        password: ENV.RABBITMQ_PASSWORD,
      });
      return connection;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private async createChannel(conn: Connection): Promise<Channel> {
    try {
      console.log('creating message broker channel...');
      const channel = await conn.createChannel();
      return channel;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async send(topic: string, message: string): Promise<void> {
    try {
      const connection = await this.connect();
      const channel = await this.createChannel(connection);

      console.log(`[${topic}] asserting to queue...`);
      await channel.assertQueue(topic, { durable: true });
      channel.sendToQueue(topic, Buffer.from(message));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async consume(topic: string, onMessage: OnMessage): Promise<void> {
    const connection = await this.connect();
    const channel = await this.createChannel(connection);

    console.log(`[${topic}] asserting to queue...`);
    await channel.assertQueue(topic, { durable: true });

    console.log(`[${topic}] listening for new messages...`);
    channel.consume(topic, async (msg) => {
      if (msg) {
        console.log(`[${topic}] new message`);
        const { content } = msg;
        channel.ack(msg);
        await onMessage(content.toString());
      }
    });
  }
}
