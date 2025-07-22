import type { Item } from "../components/ItemCard";

// Extended Item interface for JSON data
export interface ServiceItem extends Item {
  category?: string;
  provider?: string;
  duration?: string;
  active?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
}

export interface Provider {
  id: number;
  name: string;
  email: string;
  bio: string;
  specialties: string[];
  verified: boolean;
  phone?: string;
  location?: string;
}

// JSON Data Manager
class JSONDataManager {
  private services: ServiceItem[] = [];
  private categories: Category[] = [];
  private providers: Provider[] = [];
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load data from JSON files
      const [servicesResponse, categoriesResponse, providersResponse] = await Promise.all([
        fetch('/data/services.json'),
        fetch('/data/categories.json'),
        fetch('/data/providers.json')
      ]);

      this.services = await servicesResponse.json();
      this.categories = await categoriesResponse.json();
      this.providers = await providersResponse.json();
      
      this.initialized = true;
      console.log(`Loaded ${this.services.length} services, ${this.categories.length} categories, ${this.providers.length} providers`);
    } catch (error) {
      console.error('Error loading JSON data:', error);
      // Fallback to empty arrays
      this.services = [];
      this.categories = [];
      this.providers = [];
    }
  }

  // Service methods
  getAllServices(): ServiceItem[] {
    return this.services.filter(service => service.active !== false);
  }

  getServiceById(id: number): ServiceItem | undefined {
    return this.services.find(service => service.id === id && service.active !== false);
  }

  getServicesByCategory(category: string): ServiceItem[] {
    return this.services.filter(service => 
      service.category === category && service.active !== false
    );
  }

  getServicesByProvider(provider: string): ServiceItem[] {
    return this.services.filter(service => 
      service.provider === provider && service.active !== false
    );
  }

  searchServices(query: string): ServiceItem[] {
    const lowercaseQuery = query.toLowerCase();
    return this.services.filter(service => 
      service.active !== false && (
        service.name.toLowerCase().includes(lowercaseQuery) ||
        service.description.toLowerCase().includes(lowercaseQuery) ||
        service.category?.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // For provider dashboard - add new service
  addService(service: Omit<ServiceItem, 'id'>): ServiceItem {
    const newService: ServiceItem = {
      ...service,
      id: Math.max(...this.services.map(s => s.id), 0) + 1,
      active: true
    };
    
    this.services.push(newService);
    this.saveToLocalStorage();
    return newService;
  }

  // For provider dashboard - update service
  updateService(id: number, updates: Partial<ServiceItem>): ServiceItem | null {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) return null;

    this.services[index] = { ...this.services[index], ...updates };
    this.saveToLocalStorage();
    return this.services[index];
  }

  // For provider dashboard - delete service (soft delete)
  deleteService(id: number): boolean {
    const index = this.services.findIndex(service => service.id === id);
    if (index === -1) return false;

    this.services[index].active = false;
    this.saveToLocalStorage();
    return true;
  }

  // Category methods
  getAllCategories(): Category[] {
    return this.categories;
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find(category => category.id === id);
  }

  // Provider methods
  getAllProviders(): Provider[] {
    return this.providers;
  }

  getProviderById(id: number): Provider | undefined {
    return this.providers.find(provider => provider.id === id);
  }

  getProviderByEmail(email: string): Provider | undefined {
    return this.providers.find(provider => provider.email === email);
  }

  // Persistence methods
  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('services_data', JSON.stringify(this.services));
        console.log('Services saved to localStorage');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  loadFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('services_data');
        if (saved) {
          const savedServices = JSON.parse(saved);
          // Merge with original data, preferring localStorage for existing services
          savedServices.forEach((savedService: ServiceItem) => {
            const index = this.services.findIndex(s => s.id === savedService.id);
            if (index >= 0) {
              this.services[index] = savedService;
            } else {
              this.services.push(savedService);
            }
          });
          console.log('Services loaded from localStorage');
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }

  // Export data (for backup/migration)
  exportData() {
    return {
      services: this.services,
      categories: this.categories,
      providers: this.providers,
      exportDate: new Date().toISOString()
    };
  }
}

// Create singleton instance
const jsonDataManager = new JSONDataManager();

// Initialize data when module loads
let initPromise: Promise<void> | null = null;

async function ensureInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = jsonDataManager.initialize().then(() => {
      jsonDataManager.loadFromLocalStorage();
    });
  }
  return initPromise;
}

// Export functions (backwards compatible with existing code)
export function getAllItems(): Item[] {
  // For now, return the data synchronously using fallback data
  // This ensures the services page works immediately
  return [
    {
      id: 1,
      name: "Reiki Healing",
      description: "One-on-one energy healing session with certified practitioners. Restore balance and promote natural healing through gentle touch therapy.",
      price: 75.00,
      image: "/images/reiki-healing.jpg"
    },
    {
      id: 2,
      name: "Nutrition Consultation",
      description: "Professional dietary guidance and meal planning. Work with certified nutritionists to improve your health and wellness.",
      price: 120.00,
      image: "/images/nutritional-guidance.jpg"
    },
    {
      id: 3,
      name: "Massage Therapy",
      description: "Relaxing therapeutic massage sessions. Reduce stress and muscle tension with our licensed massage therapists.",
      price: 150.00,
      image: "/images/massage-therapy.jpg"
    },
    {
      id: 4,
      name: "Yoga Classes",
      description: "Group and private yoga sessions for all skill levels. Improve flexibility, strength, and mindfulness.",
      price: 75.00,
      image: "/images/yoga-sessions.jpg"
    },
    {
      id: 5,
      name: "Life Coaching",
      description: "Professional guidance to help you achieve personal and professional goals. Transform your life today.",
      price: 150.00,
      image: "/images/life-coaching.jpg"
    },
    {
      id: 6,
      name: "Meditation Sessions",
      description: "Guided meditation and mindfulness training. Learn techniques to reduce stress and improve mental clarity.",
      price: 75.00,
      image: "/images/meditation-service.jpg"
    },
    {
      id: 7,
      name: "Nutrition and Holistic Apothecary Sessions",
      description: "Personalized herbal medicine consultations and holistic health guidance. Priced per 1 hour in-home session with starter kit included.",
      price: 150.00,
      image: "/images/nutrition-holistic-apothecary.jpg"
    }
  ];
}

export async function getItemById(id: number): Promise<Item | undefined> {
  await ensureInitialized();
  return jsonDataManager.getServiceById(id);
}

// Async versions for future use
export async function getAllItemsAsync(): Promise<Item[]> {
  await ensureInitialized();
  return jsonDataManager.getAllServices();
}

export async function getItemByIdAsync(id: number): Promise<Item | undefined> {
  await ensureInitialized();
  return jsonDataManager.getServiceById(id);
}

export async function getItemsByCategory(category: string): Promise<Item[]> {
  await ensureInitialized();
  return jsonDataManager.getServicesByCategory(category);
}

export async function searchItems(query: string): Promise<Item[]> {
  await ensureInitialized();
  return jsonDataManager.searchServices(query);
}

export async function getAllCategories(): Promise<Category[]> {
  await ensureInitialized();
  return jsonDataManager.getAllCategories();
}

export async function getAllProviders(): Promise<Provider[]> {
  await ensureInitialized();
  return jsonDataManager.getAllProviders();
}

// Provider dashboard functions
export async function addNewService(service: Omit<ServiceItem, 'id'>): Promise<ServiceItem> {
  await ensureInitialized();
  return jsonDataManager.addService(service);
}

export async function updateExistingService(id: number, updates: Partial<ServiceItem>): Promise<ServiceItem | null> {
  await ensureInitialized();
  return jsonDataManager.updateService(id, updates);
}

export async function deleteExistingService(id: number): Promise<boolean> {
  await ensureInitialized();
  return jsonDataManager.deleteService(id);
}

// Utility functions
export async function getServicesByProvider(provider: string): Promise<ServiceItem[]> {
  await ensureInitialized();
  return jsonDataManager.getServicesByProvider(provider);
}

export async function exportAllData() {
  await ensureInitialized();
  return jsonDataManager.exportData();
}
