import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Business Settings in Supabase...');

  // Get the first business settings record (there should only be one)
  const settings = await prisma.businessSettings.findFirst();

  if (!settings) {
    console.error('No business settings found to update.');
    return;
  }

  const updated = await prisma.businessSettings.update({
    where: { id: settings.id },
    data: {
      contactNumber: '+91 88287 64628',
      whatsappNumber: '+91 88287 64628',
      address: 'Malad west Toyota signal , Mumbai, MH, India'
    }
  });

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
