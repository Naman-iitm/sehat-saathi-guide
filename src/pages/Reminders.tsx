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
import { Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Reminders() {
  const { token } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"medicine" | "appointment">("medicine");
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  /* Load reminders */
  useEffect(() => {
    setReminders(getReminders());
  }, []);

  /* Notification permission */
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  /* Notification checker */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const updated = reminders.map((reminder) => {
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

      setReminders(updated);
      saveReminders(updated);
    }, 30000);

    return () => clearInterval(interval);
  }, [reminders]);

  /* Add Reminder */
  const addReminder = () => {
    if (!title.trim()) return;

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      title,
      type,
      date,
      time,
      notified: false,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(updated);
    setTitle("");
  };

  /* Start Edit */
  const startEdit = (reminder: Reminder) => {
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setDate(reminder.date);
    setTime(reminder.time);
    setType(reminder.type);
  };

  /* Save Edit */
  const saveEdit = () => {
    if (!editingId) return;

    const updated = reminders.map((r) =>
      r.id === editingId
        ? { ...r, title, date, time, type, notified: false }
        : r
    );

    setReminders(updated);
    saveReminders(updated);
    setEditingId(null);
    setTitle("");
  };

  /* Delete Reminder */
  const deleteReminder = (id: string) => {
    if (!confirm("Delete this reminder?")) return;

    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
  };

  /* Log Reminder Completion */
  const logReminder = async (id: string, status: 'taken' | 'skipped') => {
    if (!token) {
      toast({
        title: "Offline Mode",
        description: "Reminder status saved locally.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reminders/${id}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: status === 'taken' ? "Medication Taken" : "Medication Skipped",
          description: "Activity logged for analytics.",
        });
      }
    } catch (error) {
      console.error("Log error:", error);
    }
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
          <Tabs
            defaultValue="medicine"
            onValueChange={(value) =>
              setType(value as "medicine" | "appointment")
            }
          >
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
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1"
            />

            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-40 dark:[color-scheme:dark]"
            />

            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-32 dark:[color-scheme:dark]"
            />

            <Button onClick={editingId ? saveEdit : addReminder}>
              {editingId ? "Save" : "Add"}
            </Button>
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
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.date} · {r.time}
                    </p>
                  </div>
                </div>

                {/* Log & Edit & Delete */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1 border-green-500/30 hover:bg-green-50 text-green-600 hidden sm:flex"
                    onClick={() => logReminder(r.id, 'taken')}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Done
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => startEdit(r)}
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteReminder(r.id)}
                    title="Delete"
                    className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
