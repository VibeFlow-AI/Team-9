import { AddItemDialog } from "@/components/add-item-dialog";
import { ItemCard } from "@/components/item-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import type { Item } from "@/types/item";
import { AlertCircle, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/items");
      setItems(response.data as Item[]);
    } catch (err) {
      setError("Failed to fetch items");
      console.error("Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemCreated = (createdItem: Item) => {
    setItems((prevItems) => [...prevItems, createdItem]);
  };

  const handleItemDeleted = async (itemId: number) => {
    try {
      await api.delete(`/api/items/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (err) {
      setError("Failed to delete item");
      console.error("Error deleting item:", err);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleRefresh = () => {
    fetchItems();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <AlertCircle className="mx-auto h-12 w-12 mb-2" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Items</h1>
              <p className="text-gray-600">
                {items.length === 0
                  ? "No items found"
                  : `${items.length} item${
                      items.length !== 1 ? "s" : ""
                    } available`}
              </p>
            </div>
            <div className="flex gap-2">
              <AddItemDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onItemCreated={handleItemCreated}
                onError={handleError}
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                }
              />
              <Button onClick={handleRefresh} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onItemDeleted={handleItemDeleted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
