"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ApiDocsPage() {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    // Fetch the README.md file
    fetch("/api/research/README.md")
      .then(response => response.text())
      .then(text => {
        setMarkdown(text);
      })
      .catch(error => {
        console.error("Error loading API documentation:", error);
        setMarkdown("# Error loading API documentation");
      });
  }, []);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("API Documentation")}</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: markdown }} />
      </div>
    </div>
  );
}
