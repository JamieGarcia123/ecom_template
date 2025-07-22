import { useState, useEffect } from "react";
import { Form, useActionData, useLoaderData, useNavigation, redirect } from "react-router";
import { addNewService, getAllCategories, getAllProviders, type ServiceItem, type Category, type Provider } from "../data/jsonDataManager";

// Loader function
export async function loader() {
  const [categories, providers] = await Promise.all([
    getAllCategories(),
    getAllProviders()
  ]);
  return { categories, providers };
}

// Action function to handle form submission
export async function action({ request }: { request: Request }) {
  console.log('=== ADD SERVICE ACTION CALLED ===');
  const formData = await request.formData();
  
  try {
    console.log('Form data:', Object.fromEntries(formData));
    
    // Process the service data directly here instead of calling another API
    const serviceData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      provider: formData.get('provider') as string,
      duration: formData.get('duration') as string,
      image: formData.get('image') as string || '/images/default-service.jpg'
    };

    console.log('Parsed service data:', serviceData);

    // Read current services from file system
    const fs = await import('fs');
    const path = await import('path');
    
    const servicesPath = path.join(process.cwd(), 'public', 'data', 'services.json');
    console.log('Reading from:', servicesPath);
    
    const currentData = fs.readFileSync(servicesPath, 'utf8');
    const services = JSON.parse(currentData);
    console.log('Current services count:', services.length);

    // Add new service with next available ID
    const newService = {
      ...serviceData,
      id: Math.max(...services.map((s: any) => s.id), 0) + 1,
      active: true
    };

    console.log('New service to add:', newService);

    services.push(newService);

    // Write back to file
    fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
    console.log('Service added successfully. Total services now:', services.length);

    // Redirect to provider dashboard with success message
    return redirect("/provider-dashboard?success=true&serviceName=" + encodeURIComponent(newService.name));
  } catch (error) {
    console.error('Error adding service:', error);
    return { error: "Failed to add service. Please try again." };
  }
}

export default function AddService() {
  const { categories, providers } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Add New Service</h1>
          <p className="text-gray-600">Create a new holistic service offering</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <Form method="post" className="space-y-6">
            {/* Error Message */}
            {actionData?.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {actionData.error}
                </div>
              </div>
            )}

            {/* Service Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Service Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Advanced Reiki Healing"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Detailed description of the service..."
              />
            </div>

            {/* Price and Duration Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="75.00"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="60 minutes"
                />
              </div>
            </div>

            {/* Category and Provider Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                  Provider
                </label>
                <select
                  id="provider"
                  name="provider"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider.id} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="/images/service-name.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: URL to service image (relative or absolute)
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? "Adding Service..." : "Add Service"}
              </button>
            </div>
          </Form>

          {/* Navigation Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <a
                href="/services"
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                ← Back to Services
              </a>
              <a
                href="/provider-dashboard"
                className="text-green-600 hover:text-green-500 text-sm font-medium"
              >
                Provider Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
