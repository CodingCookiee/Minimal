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
            className="h-5 w-5 absolute right-4 top-4 cursor-pointer"
            onClick={() => setShowDeleteDialog(false)}
          />
          <DialogTitle className="!mb-2 font-sf-heavy">
            Delete Address
          </DialogTitle>
          <DialogDescription className="font-sf-light flex justify-start !mb-2.5">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2.5">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="font-sf-light text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-red-700 font-sf-light text-sm transition-all duration-300"
              onClick={handleDeleteAddress}
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
