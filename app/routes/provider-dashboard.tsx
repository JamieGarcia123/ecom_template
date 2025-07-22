    import { useState, useEffect } from "react";
import { Link, redirect, useLoaderData } from "react-router";
import { ItemCard, type Item } from "../components/ItemCard";
import { getAllItems } from "../data/items";

// Loader function - check if user is logged in
export async function loader() {
  // We'll handle authentication check on the client side
  const items = getAllItems();
  return { items, username: 'provider' };
}

export default function ProviderDashboard() {
  const { items: initialItems } = useLoaderData<typeof loader>();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [username, setUsername] = useState<string>('provider');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('serviceProviderLoggedIn');
      const storedUsername = localStorage.getItem('serviceProviderUsername');
      
      if (isLoggedIn === 'true') {
        setIsAuthenticated(true);
        setUsername(storedUsername || 'provider');
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/login';
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('serviceProviderLoggedIn');
      localStorage.removeItem('serviceProviderUsername');
      window.location.href = '/login';
    }
  };

  // Handle edit item
  const handleEditItem = (item: Item) => {
    setEditingItem({ ...item });
  };

  // Handle save item
  const handleSaveItem = (updatedItem: Item) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setEditingItem(null);
    
    // In a real app, you would save to database here
    alert(`Service "${updatedItem.name}" updated successfully!`);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Provider Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/services" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
              >
                View Public Services
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Stats */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Services</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-800">
                You have {items.length} services listed. Click "Edit" on any service to update its details.
              </p>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="relative">
                <ItemCard
                  item={item}
                />
                {/* Edit Button Overlay */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={handleCancelEdit}
          onChange={setEditingItem}
        />
      )}
    </div>
  );
}

// Edit Item Modal Component
interface EditItemModalProps {
  item: Item;
  onSave: (item: Item) => void;
  onCancel: () => void;
  onChange: (item: Item) => void;
}

function EditItemModal({ item, onSave, onCancel, onChange }: EditItemModalProps) {
  const handleInputChange = (field: keyof Item, value: string | number) => {
    onChange({
      ...item,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Service</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={item.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
