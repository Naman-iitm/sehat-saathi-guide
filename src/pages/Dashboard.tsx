
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  CalendarClock,
  Pill,
  ShieldCheck,
  BellRing,
  NotebookPen,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from '@/contexts/LanguageContext';
import PredictiveAnalytics from '@/components/PredictiveAnalytics';


const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: "Active reminders", value: 4, icon: BellRing },
    { label: "Upcoming consults", value: 1, icon: Stethoscope },
    { label: "Tracked symptoms", value: 12, icon: Activity },
    { label: "Lab tests booked", value: 2, icon: NotebookPen },
  ];

  const quickLinks = [
    { to: "/symptoms", label: "Track symptoms", icon: Activity },
    { to: "/lab-tests", label: "Book lab tests", icon: NotebookPen },
    { to: "/medical-history", label: "Medical history", icon: ShieldCheck },
    { to: "/reminders", label: "Medication reminders", icon: Pill },
    { to: "/profile", label: "Profile & preferences", icon: HeartPulse },
    { to: "/assistant", label: "Ask the AI assistant", icon: Stethoscope },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="flex flex-col gap-2 mb-8">
        <p className="text-sm text-muted-foreground">Welcome back{user?.name ? `, ${user.name} ` : ""}.</p>
        <h1 className="text-3xl font-bold">Your health at a glance</h1>
        <p className="text-muted-foreground">
          Quickly jump to reminders, consultations, lab tests, and your medical history.
        </p>
      </section>

      <div className="mb-6">
        <PredictiveAnalytics />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="border-border/80">
              <CardContent className="flex items-center gap-4 py-4">
                <span className="rounded-full bg-primary/10 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-semibold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.to}
                  asChild
                  variant="secondary"
                  className="justify-start gap-2"
                >
                  <Link to={link.to}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next steps</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="rounded-full bg-primary/10 p-3 text-primary">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium">Upcoming consultation</p>
                <p className="text-sm text-muted-foreground">Dr. Sharma · Today, 6:00 PM</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link to="/consultation/123">Join</Link>
              </Button>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <span className="rounded-full bg-primary/10 p-3 text-primary">
                <Pill className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium">Medication reminder</p>
                <p className="text-sm text-muted-foreground">Vitamin D · Today, 9:00 PM</p>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link to="/reminders">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3 mt-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Health tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Stay hydrated, get quality sleep, and keep a consistent movement routine.</p>
            <p>
              Explore more tailored advice in{" "}
              <Link to="/tips" className="text-primary underline">
                Health Tips
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup & security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Keep your profile updated to ensure accurate reminders and summaries.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/profile">Review profile</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;

