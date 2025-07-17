import type { Item } from "../components/ItemCard";

// Sample item data - this could come from an API, database, or local storage
export const sampleItems: Item[] = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 199.99
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone notifications. Water-resistant design.",
    price: 299.99
  },
  {
    id: 3,
    name: "Portable Power Bank",
    description: "20,000mAh portable charger with fast charging capabilities. Compatible with all USB devices and smartphones.",
    price: 49.99
  },
  {
    id: 4,
    name: "4K Webcam",
    description: "Ultra HD webcam with auto-focus and built-in microphone. Perfect for video calls and streaming.",
    price: 129.99
  },
  {
    id: 5,
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches. Designed for gaming and productivity.",
    price: 159.99
  },
  {
    id: 6,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking and long battery life. Comfortable for extended use.",
    price: 79.99
  }
];

// Function to get all items
export function getAllItems(): Item[] {
  return sampleItems;
}

// Function to get item by ID
export function getItemById(id: number): Item | undefined {
  return sampleItems.find(item => item.id === id);
}

// Function to get items by category (you can extend this)
export function getItemsByPriceRange(min: number, max: number): Item[] {
  return sampleItems.filter(item => item.price >= min && item.price <= max);
}

// Simulate saving items to local storage
export function saveItemsToLocalStorage(items: Item[]): void {
  localStorage.setItem('savedItems', JSON.stringify(items));
}

// Simulate loading items from local storage
export function loadItemsFromLocalStorage(): Item[] {
  const saved = localStorage.getItem('savedItems');
  return saved ? JSON.parse(saved) : sampleItems;
}
