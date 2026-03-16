"use client";

import type { KnowledgeItem } from "@prisma/client";

type ExportButtonProps = {
  items: KnowledgeItem[];
};

/**
 * ExportButton: Client-side export functionality
 * Converts filtered knowledge items to JSON and triggers browser download
 * Shows count of items being exported; hidden if list is empty
 */
export function ExportButton({ items }: ExportButtonProps) {
  const handleExport = () => {
    // Serialize items with formatting for readability
    const dataStr = JSON.stringify(items, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    // Generate filename with today's date for organization
    link.download = `knowledge-items-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (items.length === 0) return null;

  return (
    <button
      onClick={handleExport}
      type="button"
      className="btn-subtle inline-flex items-center justify-center px-4 gap-2"
      title="Download filtered knowledge items as JSON"
    >
      <span>Export ({items.length})</span>
    </button>
  );
}
