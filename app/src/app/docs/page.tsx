import type { Metadata } from "next";
import DocsContent from "./DocsContent";

export const metadata: Metadata = {
  title: "Ulimi API Docs — Developer Reference",
  description:
    "Ulimi API — Trans-African dictionary. REST API reference, authentication, endpoints, and examples.",
};

export default function DocsPage() {
  return <DocsContent />;
}
