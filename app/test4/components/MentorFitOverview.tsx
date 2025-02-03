import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LearningPlanOverview } from "../types";

interface Props {
  overview: LearningPlanOverview;
}

const MentorFitOverview = ({ overview }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentor Fit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose">
          <p>{overview.mentorFitBlurb}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorFitOverview;
