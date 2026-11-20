"use client";

import React from "react";
import { ListSectionEditor } from "@/components/ListSectionEditor";

export function RosterSection({ initialData }: { initialData?: any }) {
  return (
    <ListSectionEditor
      slug="leadership"
      section="RosterSection"
      title="2. At a Glance (Leadership Roster)"
      description="Quick-navigation roster groups (National President, Vice Presidents, Secretariat) and Executive Committee label."
      label="Roster"
      initialData={initialData}
      heading={false}
      listKey="groups"
      listTitle="Roster Groups"
      listHelper="Role must match a leader's role exactly (e.g. National Vice President)."
      addLabel="Add Group"
      itemFields={[
        { key: "label", label: "Group Label", placeholder: "e.g. Plural label shown above names" },
        { key: "role", label: "Leader Role", placeholder: "e.g. National Vice President" },
      ]}
      fieldsAfterList={[
        {
          key: "executiveLabel",
          label: "Executive Committee Label",
          placeholder: "e.g. Label above the committee names",
        },
      ]}
    />
  );
}
