import { useEffect, useState } from "react";
import { Reminder } from "../types/reminder";
import { getReminders, saveReminders } from "../lib/reminderStorage";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"medicine" | "appointment">("medicine");
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState(
  new Date().toISOString().split("T")[0]
);


  useEffect(() => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}, []);
useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date();

    const updatedReminders = reminders.map((reminder) => {
      if (reminder.notified) return reminder;

      const reminderDateTime = new Date(
        `${reminder.date}T${reminder.time}:00`
      );

      if (now >= reminderDateTime) {
        if (Notification.permission === "granted") {
          new Notification("⏰ Reminder", {
            body: reminder.title,
          });
        }

        return { ...reminder, notified: true };
      }

      return reminder;
    });

    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  }, 30000); // check every 30 seconds

  return () => clearInterval(interval);
}, [reminders]);



  const addReminder = () => {
    if (!title) return;
    
    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      type,
      title,
      date,
      time,
      notified:false,
    };
    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(updated);
    setTitle("");
  };

  return (
  <div className="container mx-auto p-4 max-w-3xl">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⏰ Reminders
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tabs */}
        <Tabs defaultValue="medicine"
        onValueChange={(value) => setType(value as "medicine" | "appointment")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="medicine">💊 Medicine</TabsTrigger>
            <TabsTrigger value="appointment">📅 Appointment</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Input Section */}
        <div className="flex flex-wrap gap-2 items-center">
            <Input
                placeholder="Enter medicine or appointment"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                className="flex-1"
            />

            <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.currentTarget.value)}
                className="w-40 dark:[color-scheme:dark]"
            />

            <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.currentTarget.value)}
                className="w-32 dark:[color-scheme:dark]"
            />

            <Button onClick={addReminder}>Add</Button>
        </div>


        {/* Reminder List */}
        <div className="space-y-3">
          {reminders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No reminders yet. Add one above.
            </p>
          )}

          {reminders.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {r.type === "medicine" ? "💊" : "📅"}
                </span>
                <span className="font-medium">{r.title}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {r.date} · {r.time}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

}
