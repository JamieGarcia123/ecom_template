// Migration utility to move from sample data to database
import { getAllItems } from './items';
import { supabaseDataManager } from './supabaseManager';

export async function migrateSampleDataToSupabase() {
  try {
    console.log('Starting migration...');
    
    // Get existing sample data
    const sampleServices = getAllItems();
    
    // Create a default provider for migration
    const defaultProvider = await supabaseDataManager.createProvider({
      name: 'Migrated Provider',
      email: 'provider@example.com',
      bio: 'Services migrated from sample data',
      specialties: ['General Wellness'],
      verified: true
    });

    if (!defaultProvider) {
      throw new Error('Failed to create default provider');
    }

    // Migrate services
    for (const service of sampleServices) {
      await supabaseDataManager.addService(
        {
          name: service.name,
          description: service.description,
          price: service.price,
          image: service.image,
          source: service.source
        },
        defaultProvider.id!
      );
    }

    console.log(`Successfully migrated ${sampleServices.length} services`);
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

// Development seed data
export async function seedDatabase() {
  const services = [
    {
      name: "Reiki Healing Session",
      description: "Energy healing session to restore balance and promote natural healing through gentle touch.",
      price: 85.00,
      image: "/images/reiki-healing.jpg"
    },
    {
      name: "Holistic Nutrition Consultation", 
      description: "Personalized dietary guidance and meal planning with certified nutritionists.",
      price: 120.00,
      image: "/images/nutritional-guidance.jpg"
    },
    // Add more seed data as needed
  ];

  // Create providers and their services
  const provider = await supabaseDataManager.createProvider({
    name: 'Wellness Center',
    email: 'info@wellnesscenter.com',
    bio: 'Dedicated to holistic health and wellness',
    specialties: ['Reiki', 'Nutrition', 'Yoga'],
    verified: true
  });

  if (provider) {
    for (const service of services) {
      await supabaseDataManager.addService(service, provider.id!);
    }
  }
}
