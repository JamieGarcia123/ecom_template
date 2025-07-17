
import { Link } from "react-router";

// TypeScript interface matching the C# item class
export interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ItemCardProps {
  item: Item;
  onAddToCart?: (item: Item) => void;
  onToggleFavorite?: (item: Item) => void;
  isFavorite?: boolean;
}

export function ItemCard({ 
  item, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false 
}: ItemCardProps) {
  const handleAddToCart = () => {
    onAddToCart?.(item);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(item);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Item Image Placeholder */}
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>
      
      {/* Item Content */}
      <div className="p-4">
        {/* Item Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {item.name}
        </h3>
        
        {/* Item Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {item.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">
            ${item.price.toFixed(2)}
          </span>
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            to={`/products/${item.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
          
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}