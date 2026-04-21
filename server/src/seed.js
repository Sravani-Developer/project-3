require('dotenv').config();

const bcrypt = require('bcrypt');

const { connectDatabase } = require('./config/database');
const Event = require('./models/Event');
const User = require('./models/User');

const organizerEmail = 'organizer@eventlens.test';
const attendeeEmail = 'attendee@eventlens.test';

const eventImages = {
  Community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  Music: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  Networking: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  Wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  Technology: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
};

async function seed() {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({ email: { $in: [organizerEmail, attendeeEmail] } }),
    Event.deleteMany({
      title: {
        $in: [
          'Campus Startup Mixer',
          'Community Wellness Morning',
          'AI Career Night',
          'Neighborhood Food Truck Night',
          'Indie Music Patio Session'
        ]
      }
    })
  ]);

  const passwordHash = await bcrypt.hash('Password123', 12);
  const organizer = await User.create({
    fullName: 'EventLens Organizer',
    email: organizerEmail,
    passwordHash,
    role: 'organizer',
    city: 'Irvine'
  });

  await User.create({
    fullName: 'EventLens Attendee',
    email: attendeeEmail,
    passwordHash,
    role: 'attendee',
    city: 'Costa Mesa'
  });

  await Event.create([
    {
      title: 'Campus Startup Mixer',
      description: 'A student-friendly networking night for founders, designers, developers, and mentors building early-stage ideas.',
      category: 'Networking',
      eventDate: '2026-05-04',
      startTime: '18:00',
      location: 'Westcliff University Atrium',
      city: 'Irvine',
      capacity: 80,
      imageUrl: eventImages.Networking,
      status: 'published',
      organizer: organizer._id,
      attendees: []
    },
    {
      title: 'Community Wellness Morning',
      description: 'A low-cost neighborhood wellness meetup with guided movement, local health resources, and community connections.',
      category: 'Wellness',
      eventDate: '2026-05-11',
      startTime: '09:30',
      location: 'TeWinkle Park',
      city: 'Costa Mesa',
      capacity: 120,
      imageUrl: eventImages.Wellness,
      status: 'published',
      organizer: organizer._id,
      attendees: []
    },
    {
      title: 'AI Career Night',
      description: 'A practical meetup for students and professionals exploring artificial intelligence roles, portfolios, and interview preparation.',
      category: 'Technology',
      eventDate: '2026-05-14',
      startTime: '18:30',
      location: 'Irvine Business Center',
      city: 'Irvine',
      capacity: 100,
      imageUrl: eventImages.Technology,
      status: 'published',
      organizer: organizer._id,
      attendees: []
    },
    {
      title: 'Neighborhood Food Truck Night',
      description: 'A casual community evening with local food trucks, family-friendly tables, and space for neighbors to meet each other.',
      category: 'Community',
      eventDate: '2026-05-18',
      startTime: '17:30',
      location: 'Newport Civic Green',
      city: 'Newport Beach',
      capacity: 160,
      imageUrl: eventImages.Community,
      status: 'published',
      organizer: organizer._id,
      attendees: []
    },
    {
      title: 'Indie Music Patio Session',
      description: 'An outdoor music night featuring local indie artists, relaxed seating, and a casual after-show networking hour.',
      category: 'Music',
      eventDate: '2026-05-22',
      startTime: '19:00',
      location: 'Laguna Arts Patio',
      city: 'Laguna Beach',
      capacity: 95,
      imageUrl: eventImages.Music,
      status: 'published',
      organizer: organizer._id,
      attendees: []
    }
  ]);

  console.log('EventLens seed data created.');
  console.log(`Organizer login: ${organizerEmail} / Password123`);
  console.log(`Attendee login: ${attendeeEmail} / Password123`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
