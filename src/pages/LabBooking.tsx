import * as React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

const TIME_SLOTS = [
  "07:00 – 09:00",
  "09:00 – 11:00",
  "11:00 – 01:00",
  "01:00 – 03:00",
  "03:00 – 05:00",
];

const LabBooking = () => {
  const { id } = useParams();

  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("+91");

  const isDisabled = !date || !time || phone.length < 6;
  const handleConfirmBooking = () => {
  const bookingData = {
    testId: id,
    date: date?.toDateString(),
    timeSlot: time,
    phone: `${countryCode} ${phone}`,
  };

  console.log("Booking confirmed:", bookingData);

  alert(
    `✅ Booking Confirmed!\n\nTest: ${id}\nDate: ${bookingData.date}\nTime: ${time}\nPhone: ${bookingData.phone}`
  );
};


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-background/40 backdrop-blur-md p-6 space-y-6 shadow-lg">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold">Book Lab Test</h1>
          <p className="text-sm text-muted-foreground">
            Schedule home sample collection
          </p>
        </div>

        {/* Selected Test */}
        <div className="rounded-md bg-secondary/50 px-4 py-2 text-sm">
          Selected Test: <span className="font-medium">{id}</span>
        </div>

        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toDateString() : "Pick a date"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Slots */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Time Slot</label>

          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => (
              <Button
                key={slot}
                variant={time === slot ? "default" : "outline"}
                className="text-sm"
                onClick={() => setTime(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mobile Number</label>

          <div className="flex rounded-md border border-border overflow-hidden bg-background">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 bg-secondary text-sm outline-none"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+971">🇦🇪 +971</option>
              <option value="+44">🇬🇧 +44</option>
            </select>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="flex-1 px-3 py-2 text-sm bg-background outline-none"
            />
          </div>
        </div>

        {/* Confirm Button */}
        <Button
          className="w-full"
          disabled={isDisabled}
          onClick={handleConfirmBooking}
        >
          Confirm Booking
        </Button>

      </div>
    </div>
  );
};

export default LabBooking;
