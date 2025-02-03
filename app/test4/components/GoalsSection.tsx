import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SynthesizedGoal } from "../types";

interface Props {
  goals: SynthesizedGoal;
}

const GoalsSection = ({ goals }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-gray-700">{goals.highLevelGoal}</p>
        </div>

        <div className="space-y-4">
          {goals.subGoals.map((subGoal, index) => (
            <div key={index}>
              <h4 className="font-medium mb-2">{subGoal.title}</h4>
              <ul className="list-disc pl-4 space-y-1">
                {subGoal.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsSection;
