import { faker } from '@faker-js/faker';
import { Client } from 'pg';
import { config } from 'dotenv';

config();

async function seedUsers() {
  const client = new Client({ connectionString: process.env.APP_DATABASE_URL });

  try {
    await client.connect();
    console.log('Connected to database for seeding');

    // Clear existing users
    await client.query('DELETE FROM users');
    console.log('Cleared existing users');

    // Generate 20 fake users
    const users = [];
    for (let i = 0; i < 20; i++) {
      users.push({
        email: faker.internet.email().toLowerCase(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        isActive: faker.datatype.boolean(0.8), // 80% chance of being active
      });
    }

    // Insert users one by one to handle conflicts
    let insertedCount = 0;
    for (const user of users) {
      try {
        await client.query(
          'INSERT INTO users (email, first_name, last_name, is_active) VALUES ($1, $2, $3, $4)',
          [user.email, user.firstName, user.lastName, user.isActive]
        );
        insertedCount++;
      } catch (err: any) {
        if (err.code === '23505') {
          // Unique violation
          console.log(`Skipped duplicate email: ${user.email}`);
        } else {
          throw err;
        }
      }
    }

    console.log(`Successfully inserted ${insertedCount} users`);

    // Show sample of inserted data
    const sampleUsers = await client.query(
      'SELECT email, first_name, last_name, is_active FROM users LIMIT 5'
    );
    console.log('Sample users:');
    sampleUsers.rows.forEach(user => {
      console.log(
        `  - ${user.first_name} ${user.last_name} (${user.email}) - Active: ${user.is_active}`
      );
    });
  } catch (err: any) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Main execution
async function main() {
  console.log('🌱 Starting database seeding...');
  await seedUsers();
  console.log('✅ Database seeding completed!');
}

main().catch(console.error);
