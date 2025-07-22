import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { ItemCard, type Item } from "../components/ItemCard";
import { getAllItems } from "../data/jsonDataManager";

// Loader function required by React Router v7
export async function loader() {
  const items = getAllItems();
  return { items };
}

export function ServicesPage() {
  const { items } = useLoaderData<typeof loader>();
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('serviceFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  // Handle booking a service
  const handleBookService = (service: Item) => {
    alert(`Booking ${service.name} for $${service.price.toFixed(2)}. This would redirect to booking page.`);
  };

  // Handle toggling favorite status
  const handleToggleFavorite = (service: Item) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(service.id)
        ? prevFavorites.filter(id => id !== service.id)
        : [...prevFavorites, service.id];
      
      // Save favorites to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('serviceFavorites', JSON.stringify(newFavorites));
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-gray-600">Discover holistic services designed for your wellness journey!</p>
          
          {/* Favorites Summary */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              Favorite Services: {favorites.length} items | Total Services: {items.length}
            </p>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onAddToCart={handleBookService}
              onToggleFavorite={handleToggleFavorite}
              isFavorite={favorites.includes(item.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No Services found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export required by React Router v7
export default ServicesPage;
