import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yuvaa Engineers — Licensed Building Surveyor & CSC Operator" },
      {
        name: "description",
        content:
          "Precision-driven building surveying and certified CSC services in Dharmapuri, Tamil Nadu.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);
  return null;
}
