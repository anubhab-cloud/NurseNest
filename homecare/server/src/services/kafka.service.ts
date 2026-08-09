import { publishKafkaEvent, KAFKA_TOPICS, consumer, isConnected } from '../config/kafka';

// ─── Kafka Producers ───────────────────────────────────────────────────────────

export const publishBookingEvent = async (
  eventType: 'CREATED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  bookingData: Record<string, any>
) => {
  return publishKafkaEvent(KAFKA_TOPICS.BOOKING_EVENTS, `BOOKING_${eventType}`, {
    bookingId: bookingData._id || bookingData.id,
    patientId: bookingData.patientId,
    nurseId: bookingData.nurseId,
    serviceType: bookingData.serviceType,
    status: bookingData.status,
    totalAmount: bookingData.billing?.totalAmount,
    updatedAt: new Date().toISOString(),
  });
};

export const publishVitalsLoggedEvent = async (vitalsData: Record<string, any>) => {
  return publishKafkaEvent(KAFKA_TOPICS.VITALS_EVENTS, 'VITALS_RECORDED', {
    recordId: vitalsData._id,
    userId: vitalsData.userId || vitalsData.patientId,
    vitals: vitalsData.vitals,
    recordedAt: vitalsData.recordedAt || new Date().toISOString(),
  });
};

export const publishSosAlertEvent = async (sosData: Record<string, any>) => {
  return publishKafkaEvent(KAFKA_TOPICS.SOS_ALERTS, 'SOS_TRIGGERED', {
    alertId: sosData.alertId || String(Date.now()),
    userId: sosData.userId,
    location: sosData.location,
    triggeredAt: new Date().toISOString(),
  });
};

// ─── Kafka Consumers (Async Event Handlers) ────────────────────────────────────

export const startKafkaConsumers = async (): Promise<void> => {
  if (!isConnected || !consumer) {
    return;
  }

  try {
    await consumer.connect();

    // Subscribe to all NurseNest event topics
    await consumer.subscribe({
      topics: Object.values(KAFKA_TOPICS),
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawValue = message.value?.toString();
          if (!rawValue) return;

          const data = JSON.parse(rawValue);
          console.log(`[Kafka Consumer Processed] [${topic} - partition ${partition}] Event: ${data.event}`);

          // Event routing logic
          switch (topic) {
            case KAFKA_TOPICS.BOOKING_EVENTS:
              // Async processing: e.g. update analytics, send invoice, notify caregiver
              break;

            case KAFKA_TOPICS.SOS_ALERTS:
              console.warn(`[Kafka Emergency Consumer] Processing high-priority SOS alert for user: ${data.payload?.userId}`);
              break;

            case KAFKA_TOPICS.VITALS_EVENTS:
              // Async processing: e.g. check for vital anomalies (high BP / low SpO2)
              break;

            default:
              break;
          }
        } catch (err) {
          console.error('[Kafka Consumer Error] Failed to process message:', err);
        }
      },
    });

    console.log('[Kafka Consumers] Successfully started background event listener');
  } catch (error) {
    console.error('[Kafka Consumers] Failed to start consumers:', error);
  }
};
