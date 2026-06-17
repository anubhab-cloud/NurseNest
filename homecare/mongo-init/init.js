// MongoDB initialization script for Docker
// Creates indexes and seed data for development

db = db.getSiblingDB('homecare');

// Create collections with validation
db.createCollection('users');
db.createCollection('nurseprofiles');
db.createCollection('bookings');
db.createCollection('chatmessages');
db.createCollection('conversations');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1, isActive: 1 });

db.nurseprofiles.createIndex({ location: '2dsphere' });
db.nurseprofiles.createIndex({ verificationStatus: 1, isOnline: 1 });
db.nurseprofiles.createIndex({ specializations: 1, averageRating: -1 });

db.bookings.createIndex(
  { nurseId: 1, scheduledDate: 1, startTime: 1, endTime: 1, status: 1 },
  { name: 'nurse_schedule_lookup' }
);

db.chatmessages.createIndex({ conversationId: 1, createdAt: -1 });

print('✅ Homecare database initialized with indexes');
