import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SessionStructure as SessionStructureType } from "../types";

interface Props {
  structure: SessionStructureType;
}

const SessionStructure = ({ structure }: Props) => {
  const [showFirstSession, setShowFirstSession] = useState(true);
  const currentAgenda = showFirstSession
    ? structure.firstSessionAgenda
    : structure.generalSessionAgenda;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Session Structure</CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">First Session</span>
            <Switch
              checked={!showFirstSession}
              onCheckedChange={(checked) => setShowFirstSession(!checked)}
            />
            <span className="text-sm text-gray-600">General Sessions</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {currentAgenda.map((section, index) => (
            <div key={index}>
              <h4 className="font-medium">{section.title}</h4>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {section.items.map((item, itemIndex) => (
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

export default SessionStructure;
