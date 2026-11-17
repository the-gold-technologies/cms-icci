import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EventForm } from "../components/EventForm";

export default function CreateEventPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>
      <PageHeader title="Add New Event" description="Add a conference, meeting or workshop to /events." />
      <EventForm />
    </div>
  );
}
