"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";
import { SelectOrCustomField } from "@/components/SelectOrCustomField";
import { slugify } from "@/lib/collection-input";
import { LEADER_ROLES, LEADER_TIERS } from "@/lib/site-pages";

const selectLabel = "text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide ml-1";

export function LeaderForm({
  initialData,
  isEdit = false,
}: {
  initialData?: any;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState<string>(initialData?.name ?? "");
  const [slug, setSlug] = useState<string>(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState<boolean>(isEdit);
  const [role, setRole] = useState<string>(initialData?.role ?? "");
  const [tier, setTier] = useState<string>(initialData?.tier ?? "");
  const [org, setOrg] = useState<string>(initialData?.org ?? "");
  const [photo, setPhoto] = useState<string>(initialData?.photo ?? "");
  const [photoAlt, setPhotoAlt] = useState<string>(initialData?.photoAlt ?? "");
  const [faceX, setFaceX] = useState<number>(initialData?.faceX ?? 0.5);
  const [faceY, setFaceY] = useState<number>(initialData?.faceY ?? 0.4);
  const [bio, setBio] = useState<string>(
    Array.isArray(initialData?.bio) ? initialData.bio.join("\n\n") : "",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !tier) {
      toast.error("Please fill in Name, Role and Tier.");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch(isEdit ? `/api/leaders/${initialData.id}` : "/api/leaders", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: slug || slugify(name),
          role,
          tier,
          org,
          photo,
          photoAlt,
          faceX,
          faceY,
          bio,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success(isEdit ? "Leader updated successfully!" : "Leader added successfully!");
        setTimeout(() => router.push("/leaders"), 800);
      } else toast.error(json.error || "Failed to save leader");
    } catch (err: any) {
      toast.error(err?.message || "Network error while saving");
    } finally {
      setLoading(false);
    }
  };

  const slider = (label: string, value: number, onChange: (v: number) => void, help: string) => (
    <div className="flex flex-col gap-1.5">
      <label className={selectLabel}>
        {label}: {Math.round(value * 100)}%
      </label>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="accent-[#ee6a2c]"
      />
      <span className="text-[11px] text-gray-400 ml-1">{help}</span>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-100 flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Full Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          placeholder="e.g. First and last name"
        />
        <InputField
          label="Profile Anchor"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          helperText="Links go to /leadership#<anchor>."
          placeholder="e.g. first-last"
        />
        <SelectOrCustomField
          label="Role"
          value={role}
          onChange={setRole}
          options={LEADER_ROLES as unknown as string[]}
          placeholder="Select role..."
          customPlaceholder="e.g. Patron, Chairman, Chief Advisor..."
          helperText="Select from preset chamber roles or enter a custom designation."
          required
        />
        <SelectOrCustomField
          label="Tier"
          value={tier}
          onChange={setTier}
          options={LEADER_TIERS.map((t) => ({ label: t.label, value: t.key }))}
          placeholder="Select tier..."
          customPlaceholder="e.g. advisory, patron, chapter..."
          helperText="Groups the leader on the Leadership page."
          required
        />
      </div>

      <InputField
        label="Organisation / Designation"
        value={org}
        onChange={(e) => setOrg(e.target.value)}
        placeholder="e.g. Company and position, shown under the name"
      />

      <TextAreaField
        label="Profile Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={12}
        helperText="Separate paragraphs with a blank line. Without a bio the 'Read profile' button is hidden."
        placeholder="e.g. Background, experience and role in ICCI…"
      />

      <div className="border-t border-gray-100 pt-5 space-y-4">
        <ImagePickerField
          label="Portrait (4:5, about 600×750)"
          value={photo}
          onChange={setPhoto}
          folder="icci/leaders"
          helperText="Without a photo the website shows the person's initials."
        />
        <InputField
          label="Photo Alt Text"
          value={photoAlt}
          onChange={(e) => setPhotoAlt(e.target.value)}
          placeholder="e.g. Usually the person's name"
        />
        {photo && (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="relative w-[200px] aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="w-full h-full object-cover" />
              <span
                className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white ring-2 ring-[#ee6a2c] pointer-events-none"
                style={{ left: `${faceX * 100}%`, top: `${faceY * 100}%` }}
              />
            </div>
            <div className="space-y-5">
              <p className="text-xs text-gray-500">
                Place the marker on the middle of the face. The website centres every crop (square
                cards, wide cards, round avatars) on this point.
              </p>
              {slider("Face — horizontal", faceX, setFaceX, "0% = left edge, 100% = right edge")}
              {slider("Face — vertical", faceY, setFaceY, "0% = top edge, 100% = bottom edge")}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 w-full">
        <SaveButton
          type="submit"
          loading={loading}
          saved={saved}
          label={isEdit ? "Update Leader" : "Add Leader"}
        />
      </div>
    </form>
  );
}
