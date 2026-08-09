import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import { config } from './env';

// ─── Kafka Topics Definition ───────────────────────────────────────────────────
export const KAFKA_TOPICS = {
  BOOKING_EVENTS: 'nursenest.booking.events',
  VITALS_EVENTS: 'nursenest.vitals.events',
  SOS_ALERTS: 'nursenest.sos.alerts',
  NOTIFICATION_EVENTS: 'nursenest.notification.events',
} as const;

let kafka: Kafka | null = null;
let producer: Producer | null = null;
let consumer: Consumer | null = null;
let isConnected = false;

// ─── Initialize Kafka Connection ───────────────────────────────────────────────
export const initializeKafka = async (): Promise<boolean> => {
  if (!config.kafka.enabled) {
    console.log('[Kafka] Kafka is disabled via KAFKA_ENABLED=false');
    return false;
  }

  try {
    kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
      logLevel: config.env === 'development' ? logLevel.WARN : logLevel.ERROR,
      retry: {
        initialRetryTime: 300,
        retries: 3,
      },
    });

    producer = kafka.producer();
    consumer = kafka.consumer({ groupId: 'nursenest-backend-group' });

    // Connect producer with quick timeout handling for dev fallback
    const connectPromise = producer.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Kafka connection timeout')), 3000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    isConnected = true;
    console.log(`[Kafka] Connected to brokers: ${config.kafka.brokers.join(', ')}`);

    // Ensure topics exist
    const admin = kafka.admin();
    await admin.connect();
    const existingTopics = await admin.listTopics();
    const topicsToCreate = Object.values(KAFKA_TOPICS).filter(
      (topic) => !existingTopics.includes(topic)
    );

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate.map((topic) => ({
          topic,
          numPartitions: 2,
          replicationFactor: 1,
        })),
      });
      console.log(`[Kafka] Created topics: ${topicsToCreate.join(', ')}`);
    }
    await admin.disconnect();

    return true;
  } catch (error: any) {
    console.warn(`[Kafka] Kafka offline or unavailable (${error.message}). Falling back to sync execution.`);
    isConnected = false;
    producer = null;
    consumer = null;
    return false;
  }
};

// ─── Publish Event Helper ──────────────────────────────────────────────────────
export const publishKafkaEvent = async (
  topic: string,
  event: string,
  payload: Record<string, any>
): Promise<boolean> => {
  if (!isConnected || !producer) {
    console.log(`[Kafka Fallback Log] Topic [${topic}] Event [${event}]:`, payload);
    return false;
  }

  try {
    await producer.send({
      topic,
      messages: [
        {
          key: payload.bookingId || payload.userId || String(Date.now()),
          value: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            payload,
          }),
        },
      ],
    });
    console.log(`[Kafka Event Published] Topic [${topic}] -> ${event}`);
    return true;
  } catch (error) {
    console.error(`[Kafka Publish Error] Topic [${topic}]:`, error);
    return false;
  }
};

export { kafka, producer, consumer, isConnected };
