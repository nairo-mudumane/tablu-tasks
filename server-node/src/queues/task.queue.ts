import { RabbitMQClient } from '../lib/rabbitmq';

const rabbitMQClient = new RabbitMQClient();

export const publishTaskEvent = async (eventType: string, taskData: string) => {
  await rabbitMQClient.send(eventType, taskData);
};
