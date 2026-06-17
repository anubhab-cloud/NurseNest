import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';

async function seed() {
  await mongoose.connect(config.mongodb.uri);
  console.log('Connected to MongoDB for seeding...');

  const db = mongoose.connection.db!;

  // Clear existing data
  await db.collection('users').deleteMany({});
  await db.collection('nurseprofiles').deleteMany({});
  await db.collection('bookings').deleteMany({});
  await db.collection('notifications').deleteMany({});

  const hashedPassword = await bcrypt.hash('Password123!', 12);

  // ─── Create Users ──────────────────────────────────────────────────────────

  const users = await db.collection('users').insertMany([
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@homecare.app',
      phone: '+1234567890',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'John',
      lastName: 'Patient',
      email: 'patient@homecare.app',
      phone: '+1234567891',
      password: hashedPassword,
      role: 'patient',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Sarah',
      lastName: 'Thompson',
      email: 'sarah@homecare.app',
      phone: '+1234567892',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Emily',
      lastName: 'Roberts',
      email: 'emily@homecare.app',
      phone: '+1234567893',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael@homecare.app',
      phone: '+1234567894',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Jessica',
      lastName: 'Williams',
      email: 'jessica@homecare.app',
      phone: '+1234567895',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'David',
      lastName: 'Kumar',
      email: 'david@homecare.app',
      phone: '+1234567896',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Amanda',
      lastName: 'Johnson',
      email: 'amanda@homecare.app',
      phone: '+1234567897',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Rachel',
      lastName: 'Martinez',
      email: 'rachel@homecare.app',
      phone: '+1234567898',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james@homecare.app',
      phone: '+1234567899',
      password: hashedPassword,
      role: 'nurse',
      isEmailVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const userIds = Object.values(users.insertedIds);
  const nurseUserIds = userIds.slice(2); // Skip admin and patient

  // ─── Create Nurse Profiles ─────────────────────────────────────────────────

  const nurseData = [
    {
      userId: nurseUserIds[0],
      specializations: ['elderly-care', 'palliative'],
      bio: 'Dedicated elderly care specialist with over 8 years of experience providing compassionate home healthcare services. Specialized in dementia care and mobility assistance.',
      yearsOfExperience: 8,
      hourlyRate: 45,
      dailyRate: 320,
      averageRating: 4.9,
      totalReviews: 127,
      totalBookings: 245,
      isOnline: true,
      languages: ['English', 'Spanish'],
      location: { type: 'Point', coordinates: [-73.9857, 40.7484], address: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001' },
    },
    {
      userId: nurseUserIds[1],
      specializations: ['post-operative', 'wound-care'],
      bio: 'Board-certified wound care nurse with expertise in post-surgical recovery. I help patients heal faster with evidence-based protocols and personalized care plans.',
      yearsOfExperience: 12,
      hourlyRate: 55,
      dailyRate: 400,
      averageRating: 4.8,
      totalReviews: 89,
      totalBookings: 178,
      isOnline: true,
      languages: ['English'],
      location: { type: 'Point', coordinates: [-73.9712, 40.7831], address: '456 Oak Ave', city: 'New York', state: 'NY', zipCode: '10024' },
    },
    {
      userId: nurseUserIds[2],
      specializations: ['pediatric', 'general'],
      bio: 'Pediatric nursing specialist passionate about making healthcare comfortable for children. Expert in infant care, childhood vaccinations, and developmental monitoring.',
      yearsOfExperience: 6,
      hourlyRate: 40,
      dailyRate: 280,
      averageRating: 4.7,
      totalReviews: 64,
      totalBookings: 132,
      isOnline: false,
      languages: ['English', 'Mandarin'],
      location: { type: 'Point', coordinates: [-73.9654, 40.7829], address: '789 Pine Rd', city: 'New York', state: 'NY', zipCode: '10021' },
    },
    {
      userId: nurseUserIds[3],
      specializations: ['physiotherapy', 'chronic-disease'],
      bio: 'Licensed physiotherapist and chronic disease management nurse. I specialize in helping patients regain mobility and manage conditions like diabetes and arthritis.',
      yearsOfExperience: 10,
      hourlyRate: 50,
      dailyRate: 360,
      averageRating: 4.6,
      totalReviews: 52,
      totalBookings: 98,
      isOnline: true,
      languages: ['English', 'Hindi'],
      location: { type: 'Point', coordinates: [-74.0060, 40.7128], address: '321 Elm St', city: 'New York', state: 'NY', zipCode: '10007' },
    },
    {
      userId: nurseUserIds[4],
      specializations: ['mental-health', 'general'],
      bio: 'Psychiatric nurse practitioner with a holistic approach to mental health. Providing compassionate support for anxiety, depression, and stress management in home settings.',
      yearsOfExperience: 7,
      hourlyRate: 60,
      dailyRate: 420,
      averageRating: 4.9,
      totalReviews: 73,
      totalBookings: 156,
      isOnline: true,
      languages: ['English', 'French'],
      location: { type: 'Point', coordinates: [-73.9442, 40.6782], address: '555 Maple Dr', city: 'Brooklyn', state: 'NY', zipCode: '11217' },
    },
    {
      userId: nurseUserIds[5],
      specializations: ['maternal', 'pediatric'],
      bio: 'Maternal and newborn care specialist with over a decade of experience. Expert in prenatal care, postpartum support, lactation consulting, and newborn health monitoring.',
      yearsOfExperience: 11,
      hourlyRate: 48,
      dailyRate: 340,
      averageRating: 4.8,
      totalReviews: 91,
      totalBookings: 203,
      isOnline: true,
      languages: ['English', 'Portuguese'],
      location: { type: 'Point', coordinates: [-73.9493, 40.6501], address: '777 Cedar Ln', city: 'Brooklyn', state: 'NY', zipCode: '11225' },
    },
    {
      userId: nurseUserIds[6],
      specializations: ['wound-care', 'elderly-care', 'general'],
      bio: 'Versatile healthcare professional with specializations across elderly care and wound management. Dedicated to providing dignified, patient-centered care in the comfort of home.',
      yearsOfExperience: 15,
      hourlyRate: 52,
      dailyRate: 380,
      averageRating: 4.5,
      totalReviews: 41,
      totalBookings: 87,
      isOnline: false,
      languages: ['English', 'Spanish', 'Italian'],
      location: { type: 'Point', coordinates: [-73.9776, 40.7614], address: '999 Broadway', city: 'New York', state: 'NY', zipCode: '10019' },
    },
    {
      userId: nurseUserIds[7],
      specializations: ['chronic-disease', 'physiotherapy'],
      bio: 'Specialized in managing chronic conditions with a focus on heart disease, COPD, and diabetes. Expertise in patient education and rehabilitation exercises tailored to home settings.',
      yearsOfExperience: 9,
      hourlyRate: 47,
      dailyRate: 330,
      averageRating: 4.7,
      totalReviews: 68,
      totalBookings: 142,
      isOnline: true,
      languages: ['English'],
      location: { type: 'Point', coordinates: [-73.9352, 40.7306], address: '222 River St', city: 'New York', state: 'NY', zipCode: '10009' },
    },
  ];

  const availability = [
    { dayOfWeek: 1, startTime: '08:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 2, startTime: '08:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 3, startTime: '08:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 4, startTime: '08:00', endTime: '18:00', isAvailable: true },
    { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isAvailable: true },
  ];

  const nurseProfiles = nurseData.map((nurse) => ({
    ...nurse,
    verificationStatus: 'approved',
    certifications: [
      { name: 'Registered Nurse (RN)', issuingBody: 'State Board of Nursing', issueDate: new Date('2015-06-01') },
      { name: 'BLS Certification', issuingBody: 'American Heart Association', issueDate: new Date('2023-01-15') },
    ],
    availability,
    serviceRadius: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.collection('nurseprofiles').insertMany(nurseProfiles);

  // Create 2dsphere index
  await db.collection('nurseprofiles').createIndex({ location: '2dsphere' });

  console.log('✅ Seed complete!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Admin:   admin@homecare.app    / Password123!');
  console.log('  Patient: patient@homecare.app  / Password123!');
  console.log('  Nurse:   sarah@homecare.app    / Password123!');
  console.log('');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
