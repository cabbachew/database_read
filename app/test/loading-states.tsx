import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function EngagementDataSkeleton() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardContent>
    </Card>
  );
}

export function AnalysisSkeleton() {
  return (
    <div className="grid gap-6">
      {[
        "Overview",
        "Progress Analysis",
        "Relationship Dynamic",
        "Recommendations",
      ].map((title) => (
        <Card key={title}>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
