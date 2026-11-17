import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/PageHeader";
import { LeaderForm } from "../../components/LeaderForm";

export const dynamic = "force-dynamic";

export default async function EditLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.leader.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <Link
        href="/leaders"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Leadership</span>
      </Link>
      <PageHeader
        title="Edit Leader"
        description="Update name, role, organisation, bio and portrait."
      />
      <LeaderForm initialData={JSON.parse(JSON.stringify(item))} isEdit />
    </div>
  );
}
