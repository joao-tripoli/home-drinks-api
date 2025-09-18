import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample drinks
  const sampleDrinks = [
    {
      name: 'Classic Margarita',
      description: 'A refreshing tequila-based cocktail',
      category: 'Cocktail',
      ingredients: ['Tequila', 'Lime juice', 'Triple sec', 'Salt'],
      instructions: 'Shake with ice, strain into salt-rimmed glass',
    },
    {
      name: 'Old Fashioned',
      description: 'A timeless whiskey cocktail',
      category: 'Cocktail',
      ingredients: ['Whiskey', 'Sugar', 'Angostura bitters', 'Orange peel'],
      instructions: 'Muddle sugar and bitters, add whiskey and ice, stir',
    },
  ];

  for (const drink of sampleDrinks) {
    await prisma.drink.create({
      data: drink,
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
