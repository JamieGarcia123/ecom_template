import { useLoaderData } from "react-router";
import { getItemById, getAllItems } from "../data/jsonDataManager";
import type { Item } from "../components/ItemCard";

export async function loader() {
  try {
    const allItems = await getAllItems();
    const firstItem = await getItemById(1);
    
    return { 
      allItems: allItems.slice(0, 3), // Just first 3 for testing
      firstItem,
      debug: {
        totalItems: allItems.length,
        firstItemExists: !!firstItem
      }
    };
  } catch (error) {
    return { 
      error: (error as Error).message || 'Unknown error',
      allItems: [] as Item[],
      firstItem: null,
      debug: { error: true }
    };
  }
}

export default function TestData() {
  const { allItems, firstItem, debug, error } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Test Page</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>

        {firstItem && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">First Item (ID: 1)</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {firstItem.name}</p>
              <p><strong>Price:</strong> ${firstItem.price}</p>
              <p><strong>Description:</strong> {firstItem.description}</p>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Items (First 3)</h2>
          {allItems.length > 0 ? (
            <div className="space-y-4">
              {allItems.map((item: Item) => (
                <div key={item.id} className="border border-gray-200 rounded p-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-green-600 font-bold">${item.price}</p>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items found</p>
          )}
        </div>
      </div>
    </div>
  );
}
