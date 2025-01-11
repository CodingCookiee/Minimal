import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui";
import { CircleX } from "lucide-react";

export const DeleteAddressDialog = ({
  showDeleteDialog,
  setShowDeleteDialog,
  handleDeleteAddress,
}) => {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <CircleX
            className="h-4 w-4 absolute right-4 top-4 cursor-pointer"
            onClick={() => setShowDeleteDialog(false)}
          />
          <DialogTitle className="!mb-2">Delete Address</DialogTitle>
          <DialogDescription className="flex justify-start !mb-2.5">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2.5">
            <Button
              variant="destructive"
              className="bg-red-700 text-light-primary hover:bg-red-600 transition-all duration-300"
              onClick={handleDeleteAddress}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
