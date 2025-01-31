import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LearningPlanOverview } from "../types";

interface Props {
  overview: LearningPlanOverview;
}

const EngagementOverview = ({ overview }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose">
          <p>{overview.engagementBlurb}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementOverview;
