import { useState, useEffect } from "react";
import { ItemCard, type Item } from "../components/ItemCard";

export function ServicesPage() {
  const [items, setItems] = useState<Item[]>([]);
 
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-gray-600">Discover our collection of high-quality products</p>
     
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
            />
          ))}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
}
