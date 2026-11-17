"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { SaveButton } from "@/components/SaveButton";
import { SelectOrCustomField } from "@/components/SelectOrCustomField";

export function EventForm({
  initialData,
  isEdit = false,
}: {
  initialData?: any;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [title, setTitle] = useState<string>(initialData?.title ?? "");
  const [date, setDate] = useState<string>(initialData?.date ?? "");
  const [location, setLocation] = useState<string>(initialData?.location ?? "");
  const [text, setText] = useState<string>(initialData?.text ?? "");
  const [status, setStatus] = useState<string>(
    initialData ? (initialData.isPast ? "past" : "upcoming") : "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !location || !status) {
      toast.error("Please fill in Title, Date, Location and Status.");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(isEdit ? `/api/events/${initialData.id}` : "/api/events", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, location, text, isPast: status === "past" }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(isEdit ? "Event updated successfully!" : "Event added successfully!");
        setTimeout(() => router.push("/events"), 800);
      } else toast.error(json.error || "Failed to save event");
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6"
    >
      <InputField
        label="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Name of the conference or workshop"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="e.g. 12 December 2026"
        />
        <InputField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Venue and city"
        />
        <SelectOrCustomField
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { label: "Upcoming", value: "upcoming" },
            { label: "Past", value: "past" },
          ]}
          allowCustom={false}
          placeholder="Select status..."
          required
        />
      </div>
      <TextAreaField
        label="Description"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="e.g. What the event covers and who should attend"
      />
      <div className="pt-4 border-t border-gray-100 w-full">
        <SaveButton
          type="submit"
          loading={loading}
          saved={saved}
          label={isEdit ? "Update Event" : "Add Event"}
        />
      </div>
    </form>
  );
}
