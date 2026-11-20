"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { IntroSectionEditor } from "@/components/IntroSectionEditor";

export function ContactDetailsSection({ initialData }: { initialData?: any }) {
  return (
    <IntroSectionEditor
      slug="contact"
      section="ContactDetailsSection"
      title="2. Secretariat Details & Interactive Map"
      description="Labels for physical office address, phone, official email, and Google Maps location embed."
      label="Contact Details"
      initialData={initialData}
      heading={false}
      extra={[
        {
          key: "addressLabel",
          label: "Address Label",
          placeholder: "e.g. Label above the address",
        },
        { key: "phoneLabel", label: "Phone Label", placeholder: "e.g. Label above the phone" },
        { key: "emailLabel", label: "Email Label", placeholder: "e.g. Label above the email" },
        {
          key: "mapTitle",
          label: "Map Title (accessibility)",
          placeholder: "e.g. Describes the map",
        },
        {
          key: "mapEmbedUrl",
          label: "Google Maps Embed URL",
          placeholder: "e.g. https://maps.google.com/maps?q=...&output=embed",
          multiline: true,
        },
      ]}
      managed={[
        {
          icon: MapPin,
          title: "Address, phone and email are global",
          text: "They are shared with the footer and edited under Social Media & Footer.",
          href: "/navigation/social-media",
          linkLabel: "Edit Contact Details",
        },
      ]}
    />
  );
}
