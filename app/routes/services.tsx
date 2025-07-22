import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { ItemCard, type Item } from "../components/ItemCard";
import { getAllItems } from "../data/jsonDataManager";

// Loader function required by React Router v7
export async function loader() {
  const items = await getAllItems();
  return { items };
}

export function ServicesPage() {
  const { items: allItems } = useLoaderData<typeof loader>();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredItems, setFilteredItems] = useState<Item[]>(allItems);

  // Get unique categories from items
  const categories = Array.from(new Set(allItems.map((item: any) => item.category).filter(Boolean)));

  // Filter items based on search query and category
  useEffect(() => {
    let filtered = allItems;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((item: any) => item.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item: any) => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.provider && item.provider.toLowerCase().includes(query))
      );
    }

    setFilteredItems(filtered);
  }, [allItems, searchQuery, selectedCategory]);

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
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search services, categories, or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Search Results Summary */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <p className="text-sm text-gray-600">
              Showing {filteredItems.length} of {allItems.length} services
              {searchQuery && (
                <span className="ml-1">
                  for "<span className="font-medium">{searchQuery}</span>"
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="ml-1">
                  in <span className="font-medium">{selectedCategory}</span>
                </span>
              )}
            </p>
            
            {/* Favorites Summary */}
            <div className="text-sm text-green-600">
              ❤️ {favorites.length} favorites
            </div>
          </div>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item: Item) => (
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
        {filteredItems.length === 0 && allItems.length > 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              No services match your current search criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Clear search and show all services
            </button>
          </div>
        )}

        {/* No Services Available */}
        {allItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Default export required by React Router v7
export default ServicesPage;
