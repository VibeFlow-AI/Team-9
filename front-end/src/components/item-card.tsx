import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Item } from "@/types/item";
import { Hash, Tag, Trash2 } from "lucide-react";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
  onItemDeleted: (itemId: number) => Promise<void>;
}

export function ItemCard({ item, onItemDeleted }: ItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setIsDeleting(true);
      try {
        await onItemDeleted(item.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">{item.name.charAt(0).toUpperCase()}</span>
          </div>
          {item.name}
        </CardTitle>
        <CardDescription>Item ID: {item.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="w-4 h-4 mr-2" />
            {item.name}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Hash className="w-4 h-4 mr-2" />
            ID: {item.id}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
