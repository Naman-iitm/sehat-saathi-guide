import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LabBooking = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-6 max-w-md space-y-6">
      <h1 className="text-xl font-semibold">
        Book: {id?.replace("-", " ")}
      </h1>

      <div className="space-y-3">
        <input
          placeholder="Patient Name"
          className="w-full p-3 rounded-md border bg-background"
        />
        <input
          placeholder="Mobile Number"
          className="w-full p-3 rounded-md border bg-background"
        />
        <input
          type="date"
          className="w-full p-3 rounded-md border bg-background"
        />
      </div>

      <Button className="w-full">Confirm Booking</Button>

      <p className="text-xs text-muted-foreground text-center">
        Booking is currently a demo (no payment required)
      </p>
    </div>
  );
};

export default LabBooking;
