"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [uuid, setUuid] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/proposal/${uuid}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Search Engagement Proposal</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          placeholder="Enter proposal UUID"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </form>
    </div>
  );
}

// "use client";

// import { useState, FormEvent } from "react";
// import CopyButton from "./components/CopyButton";
// import ExportFormattedPDFButton from "./components/ExportFormattedPDFButton";

// // Define types for your state variables
// type AnalysisResult = {
//   result: string;
//   error: string | null;
// };

// // Add this type definition near the top of the file, after the existing AnalysisResult type
// type EngagementData = {
//   studentName: string | null;
//   title: string | null;
//   mentorName: string | null;
//   status: string;
// };

// export default function Home() {
//   const [uuid, setUuid] = useState("");
//   const [data, setData] = useState<EngagementData | null>(null);
//   const [error, setError] = useState("");
//   const [prompt, setPrompt] = useState("");
//   const [analysis, setAnalysis] = useState<string>("");
//   const [isSearchLoading, setIsSearchLoading] = useState(false);
//   const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);

//   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setIsSearchLoading(true);
//     setError(""); // Clear any previous errors
//     setPrompt(""); // Clear previous prompt
//     setAnalysis(""); // Clear previous analysis

//     try {
//       const formData = new FormData(event.currentTarget);
//       const uuid = formData.get("uuid") || "";

//       // Validate UUID format
//       const uuidRegex =
//         /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//       if (!uuidRegex.test(uuid.toString())) {
//         setError("Invalid UUID format");
//         return;
//       }

//       const response = await fetch(`/api/engagement?uuid=${uuid}`, {
//         method: "GET",
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.error || `HTTP error! status: ${response.status}`
//         );
//       }

//       const result = await response.json();
//       if (result.error) {
//         throw new Error(result.error);
//       }

//       setData(result.data);
//     } catch (error: unknown) {
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Failed to fetch engagement data";
//       console.error("Failed:", errorMessage);
//       setError(errorMessage);
//       setData(null);
//     } finally {
//       setIsSearchLoading(false);
//     }
//   };

//   const handleAnalyze = async (
//     event: FormEvent<HTMLFormElement>
//   ): Promise<void> => {
//     event.preventDefault();
//     setIsAnalysisLoading(true);
//     setError(""); // Clear previous errors

//     try {
//       if (!prompt.trim()) {
//         throw new Error("Please enter a question to analyze");
//       }

//       const response = await fetch("/api/analyze", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt,
//           data,
//         }),
//       });

//       const result: AnalysisResult = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result.error || `HTTP error! status: ${response.status}`
//         );
//       }

//       if (result.error) {
//         setError(result.error);
//       } else {
//         setError("");
//         setAnalysis(result.result);
//       }
//     } catch (error: unknown) {
//       console.error(
//         "Analysis failed:",
//         error instanceof Error ? error.message : "Unknown error"
//       );
//       setError(
//         error instanceof Error ? error.message : "An unknown error occurred"
//       );
//       setAnalysis(""); // Clear previous analysis on error
//     } finally {
//       setIsAnalysisLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-white p-8">
//       <h1 className="text-2xl font-bold mb-6 text-gray-900">
//         Lookup Engagement by UUID
//       </h1>

//       <form onSubmit={handleSubmit} className="mb-6">
//         <input
//           type="text"
//           name="uuid"
//           placeholder="Enter engagement UUID"
//           value={uuid}
//           onChange={(e) => setUuid(e.target.value)}
//           className="w-80 mr-3 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           disabled={isSearchLoading}
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
//           disabled={isSearchLoading}
//         >
//           {isSearchLoading ? "Searching..." : "Search"}
//         </button>
//       </form>

//       {isSearchLoading && uuid && (
//         <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
//           <div className="flex items-center space-x-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
//             <p className="text-gray-600">Looking up engagement...</p>
//           </div>
//         </div>
//       )}

//       {data && (
//         <form onSubmit={handleAnalyze} className="mb-6">
//           <input
//             type="text"
//             placeholder="Ask a question about this engagement..."
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             className="w-full mb-3 px-4 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             disabled={isAnalysisLoading}
//           />
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
//             disabled={isAnalysisLoading}
//           >
//             {isAnalysisLoading ? "Analyzing..." : "Analyze"}
//           </button>
//         </form>
//       )}

//       {isAnalysisLoading && prompt && (
//         <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
//           <div className="flex items-center space-x-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
//             <p className="text-gray-600">Analyzing your question...</p>
//           </div>
//         </div>
//       )}

//       {analysis && !isAnalysisLoading && (
//         <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
//           <h2 className="text-xl font-semibold mb-4 text-gray-900">Analysis</h2>
//           <p className="whitespace-pre-wrap text-gray-700">{analysis}</p>
//         </div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <strong className="text-red-700">Error:</strong>{" "}
//           <span className="text-red-600">{error}</span>
//         </div>
//       )}

//       {data && (
//         <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-white">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Formatted Details
//             </h2>
//             <ExportFormattedPDFButton
//               data={{
//                 studentName: data.studentName as string | null,
//                 title: data.title as string | null,
//                 mentorName: data.mentorName as string | null,
//                 status: data.status as string,
//               }}
//             />
//           </div>
//           <dl className="grid grid-cols-[120px_1fr] gap-2">
//             <dt className="text-gray-600">Student:</dt>
//             <dd className="text-gray-900">{data.studentName || "N/A"}</dd>

//             <dt className="text-gray-600">Title:</dt>
//             <dd className="text-gray-900">{data.title || "N/A"}</dd>

//             <dt className="text-gray-600">Mentor:</dt>
//             <dd className="text-gray-900">{data.mentorName || "N/A"}</dd>

//             <dt className="text-gray-600">Status:</dt>
//             <dd>
//               {data.status === "scheduled" ? (
//                 <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">
//                   Active
//                 </span>
//               ) : data.status === "complete" ? (
//                 <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded">
//                   Complete
//                 </span>
//               ) : (
//                 <span className="text-gray-900">{data.status || "N/A"}</span>
//               )}
//             </dd>
//           </dl>
//         </div>
//       )}

//       {data && (
//         <div className="p-6 border border-gray-200 rounded-lg bg-white">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Engagement Info
//             </h2>
//             <CopyButton textToCopy={JSON.stringify(data, null, 2)} />
//           </div>
//           <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">
//             {JSON.stringify(data, null, 2)}
//           </pre>
//         </div>
//       )}
//     </main>
//   );
// }
