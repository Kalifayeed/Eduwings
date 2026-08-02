"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Exports rows as CSV, generated in the browser.
 *
 * No server round-trip and no temporary file: the data is already on the page,
 * so `Blob` plus an object URL is both simpler and faster than an endpoint.
 */
function ExportButton({
  rows,
  filename,
}: {
  rows: Record<string, string | number | boolean | null>[];
  filename: string;
}) {
  const download = () => {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0] ?? {});
    const lines = [
      headers.join(","),
      ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
    ];

    const blob = new Blob([`﻿${lines.join("\n")}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" onClick={download} disabled={rows.length === 0}>
      <Download className="size-4" />
      Export CSV
    </Button>
  );
}

/**
 * Quote a CSV field.
 *
 * The leading apostrophe on values starting with `= + - @` prevents spreadsheet
 * formula injection — a genuine risk when exporting user-submitted text.
 */
function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

export { ExportButton };
