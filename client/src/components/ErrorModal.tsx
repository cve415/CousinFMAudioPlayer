import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  error: string;
}

export function ErrorModal({ isOpen, onClose, onRetry, error }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cousin-gray border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-white">
            <AlertTriangle className="text-red-500" size={24} />
            <span>Playback Error</span>
          </DialogTitle>
          <DialogDescription className="text-cousin-light-gray">
            {error || "Unable to load the broadcast. Please check your connection and try again."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onRetry}
            className="bg-cousin-orange text-white hover:bg-orange-600"
          >
            Retry
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
