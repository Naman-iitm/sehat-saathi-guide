import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onClose: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

const GenericComparisonModal: React.FC<Props> = ({ open, onClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generic vs Branded Comparison</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <p className="font-medium">Branded Equivalent</p>
            <p>{data.brandEquivalent} – ₹{data.brandedPrice}</p>
          </div>

          <div>
            <p className="font-medium">Generic Medicine</p>
            <p>{data.genericName} – ₹{data.genericPrice}</p>
          </div>

          <div>
            <p className="font-medium">Active Ingredients</p>
            <p>{data.activeIngredients.join(", ")}</p>
          </div>

          {data.note && (
            <Badge variant="secondary" className="mt-2">
              {data.note}
            </Badge>
          )}

          <p className="text-xs text-muted-foreground">
            Generic medicines are clinically equivalent to branded medicines.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenericComparisonModal;
