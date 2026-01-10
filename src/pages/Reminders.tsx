import { useEffect, useState } from "react";
import { Reminder, RecurrenceType } from "../types/reminder";
import { getReminders, saveReminders } from "../lib/reminderStorage";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  requestNotificationPermission,
  getNotificationState,
  showMedicineReminder,
  startReminderChecker,
  stopReminderChecker,
  markReminderTaken,
  snoozeReminder,
  resetDailyReminders,
} from "../lib/notificationService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { Bell, BellOff, Plus, Trash2, Clock, Check, AlarmClock, Pill, Calendar } from "lucide-react";

export default function Reminders() {
  const { language } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"medicine" | "appointment">("medicine");
  const [time, setTime] = useState("09:00");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [recurrence, setRecurrence] = useState<RecurrenceType>("daily");
  const [dosage, setDosage] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  // Load reminders and check notification permission
  useEffect(() => {
    const loaded = getReminders();
    setReminders(loaded);
    
    const { permission } = getNotificationState();
    setNotificationPermission(permission);
    
    // Reset daily reminders
    resetDailyReminders();
  }, []);

  // Start reminder checker
  useEffect(() => {
    startReminderChecker((reminder) => {
      showMedicineReminder(reminder);
      setActiveReminder(reminder);
      setShowReminderDialog(true);
      
      // Update local state
      setReminders(getReminders());
    });

    return () => stopReminderChecker();
  }, []);

  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    
    if (permission === "granted") {
      toast.success(language === "hi" ? "नोटिफिकेशन चालू!" : "Notifications enabled!");
    } else {
      toast.error(language === "hi" ? "नोटिफिकेशन अनुमति अस्वीकृत" : "Notification permission denied");
    }
  };

  /* Add Reminder */
  const addReminder = () => {
    if (!title.trim()) {
      toast.error(language === "hi" ? "कृपया नाम दर्ज करें" : "Please enter a name");
      return;
    }

    const newReminder: Reminder = {
      id: crypto.randomUUID(),
      type,
      title: title.trim(),
      date,
      time,
      recurrence,
      dosage: dosage.trim() || undefined,
      enabled: true,
      notified: false,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(updated);
    
    setTitle("");
    setDosage("");
    
    toast.success(language === "hi" ? "रिमाइंडर जोड़ा गया!" : "Reminder added!");
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updated);
    saveReminders(updated);
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveReminders(updated);
    toast.success(language === "hi" ? "रिमाइंडर हटाया गया" : "Reminder deleted");
  };

  const handleTaken = () => {
    if (activeReminder) {
      markReminderTaken(activeReminder.id);
      setReminders(getReminders());
      toast.success(language === "hi" ? "दवाई ली गई ✓" : "Marked as taken ✓");
    }
    setShowReminderDialog(false);
    setActiveReminder(null);
  };

  const handleSnooze = () => {
    if (activeReminder) {
      snoozeReminder(activeReminder.id, 10);
      setReminders(getReminders());
      toast.info(language === "hi" ? "10 मिनट के लिए स्नूज़" : "Snoozed for 10 minutes");
    }
    setShowReminderDialog(false);
    setActiveReminder(null);
  };

  const getRecurrenceLabel = (rec: RecurrenceType) => {
    const labels = {
      once: language === "hi" ? "एक बार" : "Once",
      daily: language === "hi" ? "रोज़" : "Daily",
      weekly: language === "hi" ? "साप्ताहिक" : "Weekly",
      monthly: language === "hi" ? "मासिक" : "Monthly",
    };
    return labels[rec];
  };

  const medicineReminders = reminders.filter(r => r.type === "medicine");
  const appointmentReminders = reminders.filter(r => r.type === "appointment");

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-6">
      {/* Notification Permission Card */}
      {notificationPermission !== "granted" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BellOff className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  {language === "hi" ? "नोटिफिकेशन बंद हैं" : "Notifications are disabled"}
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {language === "hi" 
                    ? "रिमाइंडर प्राप्त करने के लिए चालू करें" 
                    : "Enable to receive medicine reminders"}
                </p>
              </div>
            </div>
            <Button onClick={handleRequestPermission} variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              {language === "hi" ? "चालू करें" : "Enable"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Reminder Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {language === "hi" ? "नया रिमाइंडर" : "New Reminder"}
          </CardTitle>
          <CardDescription>
            {language === "hi" 
              ? "दवाई या अपॉइंटमेंट के लिए रिमाइंडर सेट करें" 
              : "Set reminders for medicines or appointments"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="medicine" onValueChange={(v) => setType(v as "medicine" | "appointment")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="medicine" className="gap-2">
                <Pill className="w-4 h-4" />
                {language === "hi" ? "दवाई" : "Medicine"}
              </TabsTrigger>
              <TabsTrigger value="appointment" className="gap-2">
                <Calendar className="w-4 h-4" />
                {language === "hi" ? "अपॉइंटमेंट" : "Appointment"}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>{language === "hi" ? "नाम" : "Name"}</Label>
              <Input
                placeholder={type === "medicine" 
                  ? (language === "hi" ? "दवाई का नाम" : "Medicine name")
                  : (language === "hi" ? "अपॉइंटमेंट विवरण" : "Appointment details")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {type === "medicine" && (
              <div className="grid gap-2">
                <Label>{language === "hi" ? "खुराक" : "Dosage"}</Label>
                <Input
                  placeholder={language === "hi" ? "जैसे: 1 गोली" : "e.g., 1 tablet"}
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>{language === "hi" ? "समय" : "Time"}</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="dark:[color-scheme:dark]"
                />
              </div>
              <div className="grid gap-2">
                <Label>{language === "hi" ? "तारीख" : "Date"}</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>{language === "hi" ? "दोहराव" : "Repeat"}</Label>
              <Select value={recurrence} onValueChange={(v) => setRecurrence(v as RecurrenceType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">{language === "hi" ? "एक बार" : "Once"}</SelectItem>
                  <SelectItem value="daily">{language === "hi" ? "रोज़" : "Daily"}</SelectItem>
                  <SelectItem value="weekly">{language === "hi" ? "साप्ताहिक" : "Weekly"}</SelectItem>
                  <SelectItem value="monthly">{language === "hi" ? "मासिक" : "Monthly"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addReminder} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              {language === "hi" ? "रिमाइंडर जोड़ें" : "Add Reminder"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Medicine Reminders */}
      {medicineReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Pill className="w-5 h-5" />
              {language === "hi" ? "दवाई रिमाइंडर" : "Medicine Reminders"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medicineReminders.map((r) => (
              <ReminderItem
                key={r.id}
                reminder={r}
                language={language}
                onToggle={() => toggleReminder(r.id)}
                onDelete={() => deleteReminder(r.id)}
                getRecurrenceLabel={getRecurrenceLabel}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Appointment Reminders */}
      {appointmentReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              {language === "hi" ? "अपॉइंटमेंट रिमाइंडर" : "Appointment Reminders"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointmentReminders.map((r) => (
              <ReminderItem
                key={r.id}
                reminder={r}
                language={language}
                onToggle={() => toggleReminder(r.id)}
                onDelete={() => deleteReminder(r.id)}
                getRecurrenceLabel={getRecurrenceLabel}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {reminders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center">
            <AlarmClock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === "hi" 
                ? "कोई रिमाइंडर नहीं। ऊपर से जोड़ें।" 
                : "No reminders yet. Add one above."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeReminder?.type === "medicine" ? "💊" : "📅"}
              {language === "hi" ? "रिमाइंडर" : "Reminder"}
            </DialogTitle>
          </DialogHeader>
          
          {activeReminder && (
            <div className="py-4">
              <h3 className="text-xl font-semibold">{activeReminder.title}</h3>
              {activeReminder.dosage && (
                <p className="text-muted-foreground">{activeReminder.dosage}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {activeReminder.time}
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleSnooze} className="flex-1">
              <AlarmClock className="w-4 h-4 mr-2" />
              {language === "hi" ? "स्नूज़ (10 मिनट)" : "Snooze (10 min)"}
            </Button>
            <Button onClick={handleTaken} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              {language === "hi" ? "ली गई" : "Taken"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reminder Item Component
interface ReminderItemProps {
  reminder: Reminder;
  language: string;
  onToggle: () => void;
  onDelete: () => void;
  getRecurrenceLabel: (rec: RecurrenceType) => string;
}

function ReminderItem({ reminder, language, onToggle, onDelete, getRecurrenceLabel }: ReminderItemProps) {
  const isTaken = reminder.takenAt && new Date(reminder.takenAt).toDateString() === new Date().toDateString();

  return (
    <div className={`flex items-center justify-between p-3 border rounded-lg transition ${
      !reminder.enabled ? "opacity-50" : ""
    } ${isTaken ? "bg-green-50 dark:bg-green-950/20 border-green-200" : "hover:bg-muted"}`}>
      <div className="flex items-center gap-3 flex-1">
        <Switch checked={reminder.enabled} onCheckedChange={onToggle} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{reminder.title}</span>
            {isTaken && <Check className="w-4 h-4 text-green-600" />}
          </div>
          {reminder.dosage && (
            <p className="text-sm text-muted-foreground">{reminder.dosage}</p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {reminder.time}
            </span>
            <span>{getRecurrenceLabel(reminder.recurrence)}</span>
          </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
