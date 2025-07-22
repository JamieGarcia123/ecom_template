import type { Item } from "../components/ItemCard";

const sampleServices: Item[] = [
  {
    id: 1,
    name: "Reaiki Healing",
    description: "One-on-one fitness coaching with certified trainers. Customized workout plans to achieve your fitness goals.",
    price: 75.00,
    image: "/images/reiki-healing.jpg",
    source: "https://www.istockphoto.com/photo/amethyst-crystal-healing-grid-gm2171418063-591277831"
  },
  {
    id: 2,
    name: "Nutrition Consultation",
    description: "Professional dietary guidance and meal planning. Work with certified nutritionists to improve your health.",
    price: 120.00,
    image: "/images/nutritional-guidance.jpg",
    source: "https://www.istockphoto.com/photo/friends-with-tablet-in-kitchen-gm2189187634-607664159"
  },
  {
    id: 3,
    name: "Massage Therapy",
    description: "Relaxing therapeutic massage sessions. Reduce stress and muscle tension with our licensed therapists.",
    price: 150.00,
    image: "/images/massage-therapy.jpg",
    source: "https://www.istockphoto.com/photo/therapists-hands-performing-vacuum-cupping-therapy-treatment-on-female-patients-skin-gm2194794106-612923930"

  },
  {
    id: 4,
    name: "Yoga Classes",
    description: "Group and private yoga sessions for all skill levels. Improve flexibility, strength, and mindfulness.",
    price: 75.00,
    image:"images/yoga-sessions.jpg",
    source: "https://www.istockphoto.com/photo/group-of-women-making-stretching-exercise-in-yoga-studio-gm1312682831-401417484"
  },      
  {
    id: 5,
    name: "Life Coaching",
    description: "Professional guidance to help you achieve personal and professional goals. Transform your life today.",
    price: 150.00,
    image: "/images/life-coaching.jpg",
    source: "https://www.istockphoto.com/photo/woman-in-pink-shirt-smiles-while-sitting-on-a-couch-gm2158629888-579261927"
  },
  {
    id: 6,
    name: "Meditation Sessions",
    description: "Guided meditation and mindfulness training. Learn techniques to reduce stress and improve mental clarity.",
    price: 75.00,
    image: "/images/meditation-service.jpg",
    source: "https://www.istockphoto.com/photo/indian-woman-her-little-daughter-do-meditation-practise-at-home-gm2205924124-623282921"
  },
    {
    id: 7,
    name: "Nutrition and Holistic Apothecary Sessions",
    description: "Personalized herbal medicine consultations and holistic health guidance, Priced per 1 hour in home session. I will provide starter kit.",
    price: 150.00,
    image: "/images/nutrition-holistic-apothecary.jpg",
    source: "https://www.istockphoto.com/photo/homeopathy-alternative-medicine-concept-gm2217581052-634160431"
  }
];

// Function to get all items
export function getAllItems(): Item[] {
  return sampleServices;
}

// Function to get item by ID
export function getItemById(id: number): Item | undefined {
  return sampleServices.find(item => item.id === id);
}

// Function to get items by category (you can extend this)
export function getItemsByPriceRange(min: number, max: number): Item[] {
  return sampleServices.filter(item => item.price >= min && item.price <= max);
}

// Simulate saving items to local storage
export function saveItemsToLocalStorage(items: Item[]): void {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

// Simulate loading items from local storage
export function loadItemsFromLocalStorage(): Item[] {
  const saved = localStorage.getItem('savedItems');
  return saved ? JSON.parse(saved) : sampleServices;
}
