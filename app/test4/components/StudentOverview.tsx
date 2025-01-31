import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LearningPlanOverview } from "../types";

interface Props {
  overview: LearningPlanOverview;
}

const StudentOverview = ({ overview }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose">
          <p>{overview.studentBlurb}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentOverview;
