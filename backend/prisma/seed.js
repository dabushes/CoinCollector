const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'collector@example.com' },
    update: {},
    create: {
      email: 'collector@example.com',
      name: 'John Collector',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'numismatist@example.com' },
    update: {},
    create: {
      email: 'numismatist@example.com',
      name: 'Jane Numismatist',
    },
  });

  console.log('👥 Created users:', { user1: user1.name, user2: user2.name });

  // Create sample coins
  const coins = [
    {
      name: 'Morgan Silver Dollar',
      country: 'United States',
      year: 1921,
      denomination: '1 Dollar',
      mintage: BigInt(44690000),
      composition: '90% Silver, 10% Copper',
      diameter: 38.1,
      weight: 26.73,
      description: 'Classic American silver dollar featuring Lady Liberty',
      condition: 'VERY_FINE',
      purchasePrice: 45.00,
      currentValue: 52.00,
      acquired: new Date('2024-01-15'),
      notes: 'Purchased from local coin shop',
      userId: user1.id,
    },
    {
      name: 'Peace Silver Dollar',
      country: 'United States',
      year: 1922,
      denomination: '1 Dollar',
      mintage: BigInt(51737000),
      composition: '90% Silver, 10% Copper',
      diameter: 38.1,
      weight: 26.73,
      description: 'Peace dollar commemorating the end of WWI',
      condition: 'FINE',
      purchasePrice: 38.00,
      currentValue: 45.00,
      acquired: new Date('2024-02-20'),
      notes: 'Inherited from grandfather',
      userId: user1.id,
    },
    {
      name: 'Walking Liberty Half Dollar',
      country: 'United States',
      year: 1943,
      denomination: '50 Cents',
      mintage: BigInt(53190000),
      composition: '90% Silver, 10% Copper',
      diameter: 30.6,
      weight: 12.5,
      description: 'Beautiful Walking Liberty design by Adolph Weinman',
      condition: 'EXTREMELY_FINE',
      purchasePrice: 25.00,
      currentValue: 28.00,
      acquired: new Date('2024-03-10'),
      userId: user2.id,
    },
    {
      name: 'Mercury Dime',
      country: 'United States',
      year: 1942,
      denomination: '10 Cents',
      mintage: BigInt(205410000),
      composition: '90% Silver, 10% Copper',
      diameter: 17.9,
      weight: 2.5,
      description: 'Mercury dime with Winged Liberty Head design',
      condition: 'VERY_GOOD',
      purchasePrice: 3.50,
      currentValue: 4.25,
      acquired: new Date('2024-01-08'),
      userId: user2.id,
    },
  ];

  for (const coinData of coins) {
    const coin = await prisma.coin.create({
      data: coinData,
    });
    console.log(`🪙 Created coin: ${coin.name} (${coin.year})`);
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });