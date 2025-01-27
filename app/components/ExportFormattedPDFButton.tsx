import { useState } from "react";
import jsPDF from "jspdf";

interface ExportFormattedPDFButtonProps {
  data: {
    studentName: string | null;
    title: string | null;
    mentorName: string | null;
    status: string;
  };
}

export default function ExportFormattedPDFButton({
  data,
}: ExportFormattedPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();

      // Set fonts and colors similar to the web view
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(17, 24, 39); // text-gray-900
      doc.text("Formatted Details", 20, 30);

      // Reset font for content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(75, 85, 99); // text-gray-600

      // Create a styled status badge
      const getStatusBadge = (status: string) => {
        if (status === "scheduled") {
          return { text: "Active", color: [209, 250, 229] }; // bg-green-100
        } else if (status === "complete") {
          return { text: "Complete", color: [243, 244, 246] }; // bg-gray-100
        }
        return { text: status, color: [255, 255, 255] };
      };

      // Add content with consistent spacing
      const startY = 50;
      const lineHeight = 15;
      let currentY = startY;

      // Labels and values
      const fields = [
        { label: "Student:", value: data.studentName || "N/A" },
        { label: "Title:", value: data.title || "N/A" },
        { label: "Mentor:", value: data.mentorName || "N/A" },
        { label: "Status:", value: getStatusBadge(data.status) },
      ];

      fields.forEach((field) => {
        // Draw label
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99); // text-gray-600
        doc.text(field.label, 20, currentY);

        // Draw value
        doc.setTextColor(17, 24, 39); // text-gray-900
        if (field.label === "Status:") {
          const badge = field.value as { text: string; color: number[] };
          // Calculate text width for proper badge sizing
          const textWidth = doc.getTextWidth(badge.text);
          // Draw status badge background with minimal padding (6 units total, 3 on each side)
          doc.setFillColor(badge.color[0], badge.color[1], badge.color[2]);
          doc.roundedRect(70, currentY - 5, textWidth + 6, 7, 1, 1, "F");
          // Center text in badge
          doc.text(badge.text, 73, currentY);
        } else {
          doc.text(field.value as string, 70, currentY);
        }

        currentY += lineHeight;
      });

      // Save the PDF
      doc.save(`engagement-details-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors ml-2"
    >
      {isExporting ? "Exporting..." : "Export PDF"}
    </button>
  );
}
