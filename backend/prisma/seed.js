import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create mints
  const mints = await Promise.all([
    prisma.mint.upsert({
      where: { mintMark: '' },
      update: {},
      create: {
        name: 'Philadelphia',
        mintMark: '',
        location: 'Philadelphia, PA',
        active: true,
      },
    }),
    prisma.mint.upsert({
      where: { mintMark: 'D' },
      update: {},
      create: {
        name: 'Denver',
        mintMark: 'D',
        location: 'Denver, CO',
        active: true,
      },
    }),
    prisma.mint.upsert({
      where: { mintMark: 'S' },
      update: {},
      create: {
        name: 'San Francisco',
        mintMark: 'S',
        location: 'San Francisco, CA',
        active: false,
      },
    }),
  ]);

  console.log('Created mints:', mints.length);

  // Create coin types
  const coinTypes = await Promise.all([
    prisma.coinType.upsert({
      where: { name: 'Lincoln Cent' },
      update: {},
      create: {
        name: 'Lincoln Cent',
        denomination: 'Cent',
        series: 'Lincoln',
        startYear: 1909,
        description: 'Lincoln cent with various reverse designs',
      },
    }),
    prisma.coinType.upsert({
      where: { name: 'Jefferson Nickel' },
      update: {},
      create: {
        name: 'Jefferson Nickel',
        denomination: 'Nickel',
        series: 'Jefferson',
        startYear: 1938,
        description: 'Jefferson nickel design',
      },
    }),
    prisma.coinType.upsert({
      where: { name: 'Roosevelt Dime' },
      update: {},
      create: {
        name: 'Roosevelt Dime',
        denomination: 'Dime',
        series: 'Roosevelt',
        startYear: 1946,
        description: 'Roosevelt dime design',
      },
    }),
    prisma.coinType.upsert({
      where: { name: 'Washington Quarter' },
      update: {},
      create: {
        name: 'Washington Quarter',
        denomination: 'Quarter',
        series: 'Washington',
        startYear: 1932,
        description: 'Washington quarter design',
      },
    }),
    prisma.coinType.upsert({
      where: { name: 'Kennedy Half Dollar' },
      update: {},
      create: {
        name: 'Kennedy Half Dollar',
        denomination: 'Half Dollar',
        series: 'Kennedy',
        startYear: 1964,
        description: 'Kennedy half dollar design',
      },
    }),
  ]);

  console.log('Created coin types:', coinTypes.length);

  // Create some sample coins
  const sampleCoins = [];
  for (const type of coinTypes) {
    for (const mint of mints) {
      // Create coins for recent years
      for (let year = 2020; year <= 2023; year++) {
        const coin = await prisma.coin.upsert({
          where: {
            unique_coin: {
              year,
              mintId: mint.id,
              typeId: type.id,
            },
          },
          update: {},
          create: {
            year,
            mintId: mint.id,
            typeId: type.id,
            condition: 'Uncirculated',
          },
        });
        sampleCoins.push(coin);
      }
    }
  }

  console.log('Created sample coins:', sampleCoins.length);

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@coincollector.com' },
    update: {},
    create: {
      email: 'demo@coincollector.com',
      name: 'Demo User',
    },
  });

  console.log('Created demo user:', demoUser.email);

  // Add some coins to demo user's collection
  const collectionItems = await Promise.all([
    prisma.userCollection.upsert({
      where: {
        unique_user_coin_condition: {
          userId: demoUser.id,
          coinId: sampleCoins[0].id,
          condition: 'Uncirculated',
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        coinId: sampleCoins[0].id,
        quantity: 1,
        condition: 'Uncirculated',
        notes: 'First coin in collection',
      },
    }),
    prisma.userCollection.upsert({
      where: {
        unique_user_coin_condition: {
          userId: demoUser.id,
          coinId: sampleCoins[5].id,
          condition: 'Very Fine',
        },
      },
      update: {},
      create: {
        userId: demoUser.id,
        coinId: sampleCoins[5].id,
        quantity: 1,
        condition: 'Very Fine',
        notes: 'Nice condition example',
      },
    }),
  ]);

  console.log('Created collection items:', collectionItems.length);
  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });