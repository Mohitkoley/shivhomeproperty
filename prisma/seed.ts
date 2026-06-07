import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@shivhomeproperty.com' },
    update: {},
    create: {
      email: 'admin@shivhomeproperty.com',
      password: adminPassword,
      name: 'Admin',
    },
  })
  console.log(`Created admin user with id: ${admin.id}`)

  // 2. Create Global Settings
  const settingsCount = await prisma.businessSettings.count()
  if (settingsCount === 0) {
    await prisma.businessSettings.create({
      data: {
        businessName: 'Shiv Home Property PG',
        ownerName: 'Shiv Owner',
        contactNumber: '+919876543210',
        whatsappNumber: '+919876543210',
        email: 'info@shivhomeproperty.com',
        address: '123 Main Road, Near College, City, India',
      },
    })
    console.log(`Created business settings`)
  }

  // 3. Create Amenities
  const amenitiesList = [
    { name: 'WiFi', icon: 'Wifi' },
    { name: 'Washing Machine', icon: 'WashingMachine' }, // custom or lucide string
    { name: 'Kitchen', icon: 'Utensils' },
    { name: 'Almira/Wardrobe', icon: 'Box' },
    { name: 'Bed & Mattress', icon: 'Bed' },
    { name: 'Fan', icon: 'Fan' },
    { name: 'Geyser', icon: 'Thermometer' },
    { name: 'RO Water', icon: 'Droplets' },
    { name: 'CCTV', icon: 'Cctv' },
    { name: 'Parking', icon: 'Car' },
    { name: 'Housekeeping', icon: 'Sparkles' },
    { name: 'Power Backup', icon: 'BatteryCharging' },
  ]

  for (const a of amenitiesList) {
    await prisma.amenity.upsert({
      where: { name: a.name },
      update: {},
      create: a,
    })
  }
  console.log(`Created amenities`)

  // 4. Create Sample PG
  const pgCount = await prisma.pgProperty.count()
  if (pgCount === 0) {
    const pg = await prisma.pgProperty.create({
      data: {
        name: 'Shiv Boys PG - Premium',
        address: 'Sector 15, Near Metro Station, City',
        pgType: 'Boys',
        description: 'Premium Boys PG with all modern facilities and home-like food.',
        rules: 'Entry till 10 PM. Outside food allowed. No smoking.',
        roomTypes: {
          create: [
            { sharingType: 'Single', rent: 12000, deposit: 12000 },
            { sharingType: '2 Sharing', rent: 8000, deposit: 8000 },
            { sharingType: '3 Sharing', rent: 6500, deposit: 6500 },
          ],
        },
      },
    })
    
    // Assign some amenities to PG
    const allAmenities = await prisma.amenity.findMany()
    for (const a of allAmenities.slice(0, 5)) {
      await prisma.pgAmenity.create({
        data: {
          pgId: pg.id,
          amenityId: a.id
        }
      })
    }

    console.log(`Created sample PG with id: ${pg.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
