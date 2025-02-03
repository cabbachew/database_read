import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SynthesizedGoal } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

        <Accordion type="single" collapsible className="w-full">
          {goals.subGoals.map((subGoal, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {subGoal.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-4 space-y-1">
                  {subGoal.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default GoalsSection;
