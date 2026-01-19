import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LabTestDetails = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold capitalize">
        {id?.replace("-", " ")}
      </h1>

      <p className="text-muted-foreground">
        This package includes detailed diagnostic tests conducted by
        certified labs with home sample collection.
      </p>

      <ul className="list-disc pl-5 text-sm space-y-1">
        <li>Home sample collection</li>
        <li>NABL certified labs</li>
        <li>Digital reports</li>
        <li>Doctor-friendly format</li>
      </ul>

      <Link to={`/lab-tests/${id}/book`}>
        <Button className="w-full">Book Now</Button>
      </Link>
    </div>
  );
};

export default LabTestDetails;
