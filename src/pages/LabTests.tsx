import {
  FlaskConical,
  TestTube2,
  Activity,
  ShieldCheck,
  Home as HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const LabTests = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-primary" />
          Lab Tests
        </h1>
        <p className="text-sm text-muted-foreground">
          Book diagnostic tests from trusted labs
        </p>
      </div>

      {/* Top Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FeatureCard
          icon={<HomeIcon />}
          title="Home Sample Collection"
          desc="Samples collected at your doorstep"
        />
        <FeatureCard
          icon={<ShieldCheck />}
          title="Trusted Labs"
          desc="NABL & ISO certified labs"
        />
        <FeatureCard
          icon={<Activity />}
          title="Accurate Reports"
          desc="Digital reports in 24–48 hrs"
        />
      </div>

      {/* Popular Packages */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Popular Health Packages
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          <PackageCard
            title="Full Body Checkup"
            tests="70+ tests"
            price="₹999"
          />
          <PackageCard
            title="Diabetes Care"
            tests="5 tests"
            price="₹399"
          />
          <PackageCard
            title="Thyroid Care"
            tests="3 tests"
            price="₹499"
          />
        </div>
      </section>

      {/* Individual Tests */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Individual Lab Tests
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TestCard
            name="Complete Blood Count (CBC)"
            report="24 hrs"
            price="₹299"
          />
          <TestCard
            name="HbA1c (Diabetes)"
            report="24 hrs"
            price="₹399"
          />
          <TestCard
            name="Thyroid Profile"
            report="24–48 hrs"
            price="₹499"
          />
          <TestCard
            name="Vitamin D"
            report="48 hrs"
            price="₹699"
          />
        </div>
      </section>
    </div>
  );
};

/* ---------------- Components ---------------- */

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="flex gap-3 p-4 rounded-xl border border-border bg-background/40 backdrop-blur-sm">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  </div>
);

const PackageCard = ({
  title,
  tests,
  price,
}: {
  title: string;
  tests: string;
  price: string;
}) => (
  <div className="min-w-[240px] p-4 rounded-xl border border-border bg-background/40 backdrop-blur-sm hover:shadow-md transition">
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground">{tests}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="font-semibold text-primary">{price}</span>
      <Link to="/lab-tests/full-body-checkup">
        <Button size="sm">View</Button>
      </Link>

    </div>
  </div>
);

const TestCard = ({
  name,
  report,
  price,
}: {
  name: string;
  report: string;
  price: string;
}) => (
  <div className="p-4 rounded-xl border border-border bg-background/40 backdrop-blur-sm hover:shadow-md transition">
    <div className="flex items-start gap-2">
      <TestTube2 className="w-5 h-5 text-primary mt-1" />
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          Report in {report}
        </p>
      </div>
    </div>

    <div className="flex justify-between items-center mt-4">
      <span className="font-semibold">{price}</span>
      <Link to="/lab-tests/cbc/book">
        <Button size="sm">Book</Button>
      </Link>

    </div>
  </div>
);

export default LabTests;
