import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Business Settings in Supabase...');

  // Get the first business settings record (there should only be one)
  const settings = await prisma.businessSettings.findFirst();

  let updated;
  if (!settings) {
    updated = await prisma.businessSettings.create({
      data: {
        businessName: 'Shiv Home Property PG',
        contactNumber: '88287 64628',
        whatsappNumber: '88287 64628',
        address: 'Malad west Toyota signal , Mumbai, MH, India'
      }
    });
  } else {
    updated = await prisma.businessSettings.update({
      where: { id: settings.id },
      data: {
        contactNumber: '88287 64628',
        whatsappNumber: '88287 64628',
      }
    });
  }

  console.log('Successfully updated business settings:', updated);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
