import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";
import { useState } from "react";

// Define the Item type or import it from the appropriate module
interface Item {
  id: string;
  name: string;
  // Add other fields as needed
}

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onItemCreated: (item: Item) => void;
  onError: (error: string) => void;
  trigger?: React.ReactNode;
}

export function AddItemDialog({ isOpen, onOpenChange, onItemCreated, onError, trigger }: AddItemDialogProps) {
  const [newItemName, setNewItemName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createItem = async () => {
    if (!newItemName.trim()) return;

    try {
      setIsCreating(true);
      const response = await api.post("/api/items", { name: newItemName.trim() });
      const createdItem = response.data as Item;
      onItemCreated(createdItem);
      setNewItemName("");
      onOpenChange(false);
    } catch (err) {
      console.error("Error creating item:", err);
      onError("Failed to create item");
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createItem();
  };

  const handleCancel = () => {
    setNewItemName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Item</DialogTitle>
          <DialogDescription>Enter a name for your new item. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
                placeholder="Enter item name..."
                autoComplete="off"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newItemName.trim() || isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
