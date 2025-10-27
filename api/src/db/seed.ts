import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

const PLACEHOLDER_IMG = 'https://images.trvl-media.com/lodging/91000000/90360000/90359600/90359583/w2880h1916x0y0-c7a3700c.jpg?impolicy=resizecrop&ra=fit&rw=455&rh=455';

async function ensureSeedUser() {
  const email = 'seed@example.com';
  const passwordPlain = 'password123';
  const passwordHash = await bcrypt.hash(passwordPlain, 10);

  const { data: existing, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .limit(1);
  if (checkError) throw checkError;
  if (existing && existing.length > 0) {
    return existing[0].id as string;
  }
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password: passwordHash, first_name: 'Seed', last_name: 'User' }])
    .select('id')
    .limit(1);
  if (error) throw error;
  return data![0].id as string;
}

async function insertHotels(userId: string) {
  const hotels = [
    {
      name: 'Oceanview Resort',
      city: 'Santa Monica',
      country: 'USA',
      description: 'Beachfront property with stunning ocean views and modern amenities.',
      type: 'Beach Resort',
      adultcount: 2,
      childcount: 2,
      facilities: ['Free WiFi', 'Parking', 'Outdoor Pool', 'Fitness Center'],
      pricepernight: 180,
      starrating: 4,
      imageUrls: [PLACEHOLDER_IMG],
    },
    {
      name: 'Alpine Lodge',
      city: 'Zermatt',
      country: 'Switzerland',
      description: 'Cozy lodge near ski slopes with panoramic mountain views.',
      type: 'Ski Resort',
      adultcount: 2,
      childcount: 1,
      facilities: ['Free WiFi', 'Parking', 'Spa'],
      pricePerNight: 220,
      starRating: 5,
      imageUrls: [PLACEHOLDER_IMG],
    },
    {
      name: 'City Business Hotel',
      city: 'Singapore',
      country: 'Singapore',
      description: 'Modern business hotel in the city center with conference rooms.',
      type: 'Business',
      adultCount: 2,
      childCount: 0,
      facilities: ['Free WiFi', 'Parking', 'Airport Shuttle'],
      pricePerNight: 150,
      starRating: 4,
      imageUrls: [PLACEHOLDER_IMG],
    },
    {
      name: 'Forest Cabin Retreat',
      city: 'Portland',
      country: 'USA',
      description: 'Rustic cabin surrounded by tranquil forest trails.',
      type: 'Cabin',
      adultCount: 2,
      childCount: 2,
      facilities: ['Free WiFi', 'Family Rooms'],
      pricePerNight: 120,
      starRating: 3,
      imageUrls: [PLACEHOLDER_IMG],
    },
    {
      name: 'Boutique Downtown Suites',
      city: 'Paris',
      country: 'France',
      description: 'Charming boutique suites close to landmarks and cafes.',
      type: 'Boutique',
      adultCount: 2,
      childCount: 1,
      facilities: ['Free WiFi', 'Non-Smoking Rooms', 'Spa'],
      pricePerNight: 200,
      starRating: 5,
      imageUrls: [PLACEHOLDER_IMG],
    },
  ];

  const payload = hotels.map((h) => ({
    user_id: userId,
    name: h.name,
    city: h.city,
    country: h.country,
    description: h.description,
    type: h.type,
    adult_count: (h as any).adultcount ?? (h as any).adultCount ?? 2,
    child_count: (h as any).childcount ?? (h as any).childCount ?? 0,
    facilities: h.facilities,
    price_per_night: (h as any).pricepernight ?? (h as any).pricePerNight,
    star_rating: (h as any).starrating ?? (h as any).starRating,
    image_urls: h.imageUrls,
    last_updated: new Date(),
  }));

  const { error } = await supabase.from('hotels').insert(payload);
  if (error) throw error;
}

async function main() {
  try {
    const userId = await ensureSeedUser();
    await insertHotels(userId);
    console.log('Seed complete: user and 5 hotels inserted');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

main();