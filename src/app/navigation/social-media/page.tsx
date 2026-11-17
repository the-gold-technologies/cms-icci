"use client";

import React, { useEffect, useState } from "react";
import {
  Share2,
  Image as ImageIcon,
  FileText,
  Compass,
  Info,
  Loader2,
  Layers,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { TextAreaField } from "@/components/TextAreaField";
import { ImagePickerField } from "@/components/ImagePickerField";
import { SaveButton } from "@/components/SaveButton";

/** Networks the website has an icon for (icci/components/Social.tsx), in display order. */
const NETWORKS = [
  { key: "facebook", label: "Facebook", field: "facebookUrl", title: "Facebook Page URL", ph: "https://www.facebook.com/profile.php?id=..." },
  { key: "instagram", label: "Instagram", field: "instagramUrl", title: "Instagram Profile URL", ph: "https://www.instagram.com/..." },
  { key: "linkedin", label: "LinkedIn", field: "linkedinUrl", title: "LinkedIn Company URL", ph: "https://www.linkedin.com/company/..." },
  { key: "x", label: "X (Twitter)", field: "xUrl", title: "X (Twitter) Profile URL", ph: "https://x.com/..." },
  { key: "youtube", label: "YouTube", field: "youtubeUrl", title: "YouTube Channel URL", ph: "https://youtube.com/@..." },
] as const;
type NetworkKey = (typeof NETWORKS)[number]["key"];

const FOOTER_KEYS = [
  "headerBrandLine1",
  "headerBrandLine2",
  "logoAlt",
  "logoMarkAlt",
  "followUsLabel",
  "quickLinksTitle",
  "reachUsTitle",
  "copyrightText",
] as const;
type FooterContent = Record<(typeof FOOTER_KEYS)[number], string>;

const s = (v: unknown) => (typeof v === "string" ? v : "");

export default function SocialMediaFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Section 1: Logos & Branding
  const [logo, setLogo] = useState("");
  const [logoMark, setLogoMark] = useState("");
  const [logoMarkWhite, setLogoMarkWhite] = useState("");

  // Section 2: Footer Details & Contact Information
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Section 3: Social Media (URL per network; labels kept from the saved list)
  const [urls, setUrls] = useState<Record<NetworkKey, string>>(
    Object.fromEntries(NETWORKS.map((n) => [n.key, ""])) as Record<NetworkKey, string>,
  );
  const [labels, setLabels] = useState<Record<string, string>>({});

  const [footer, setFooter] = useState<FooterContent>(
    Object.fromEntries(FOOTER_KEYS.map((k) => [k, ""])) as FooterContent,
  );

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/seo/global");
        const json = await res.json();
        if (json.success && json.data) {
          const cfg = json.data;
          setLogo(s(cfg.logo));
          setLogoMark(s(cfg.logoMark));
          setLogoMarkWhite(s(cfg.logoMarkWhite));
          setAddress(s(cfg.address));
          setPhone(s(cfg.phone));
          setEmail(s(cfg.email));

          const list: any[] = Array.isArray(cfg.socialLinks) ? cfg.socialLinks : [];
          setUrls(
            Object.fromEntries(
              NETWORKS.map((n) => [n.key, s(list.find((l) => l?.key === n.key)?.href) || s(cfg[n.field])]),
            ) as Record<NetworkKey, string>,
          );
          setLabels(Object.fromEntries(list.map((l) => [s(l?.key), s(l?.label)])));

          const f = cfg.footerContent && typeof cfg.footerContent === "object" ? cfg.footerContent : {};
          setFooter(Object.fromEntries(FOOTER_KEYS.map((k) => [k, s(f[k])])) as FooterContent);
        }
      } catch (err) {
        console.error("Failed to load footer & social config:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  const setF = (k: keyof FooterContent, v: string) => setFooter((p) => ({ ...p, [k]: v }));

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const bad = NETWORKS.find((n) => urls[n.key] && !/^https?:\/\//.test(urls[n.key]));
    if (bad) {
      toast.error(`${bad.label} URL must start with https://`);
      return;
    }
    setSaving(true);
    setSaved(false);
    try {
      // Rail + footer icons show the networks that have a URL, in website order
      const socialLinks = NETWORKS.filter((n) => urls[n.key].trim()).map((n) => ({
        key: n.key,
        label: labels[n.key] || n.label,
        href: urls[n.key].trim(),
      }));
      const res = await fetch("/api/seo/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logo,
          logoMark,
          logoMarkWhite,
          address,
          phone,
          email,
          socialLinks,
          ...Object.fromEntries(NETWORKS.map((n) => [n.field, urls[n.key].trim()])),
          footerContent: footer,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        toast.success("Social media & footer settings saved successfully!");
        setTimeout(() => setSaved(false), 2500);
      } else {
        toast.error(json.error || "Failed to save settings");
      }
    } catch (err: any) {
      console.error("Error saving brand config:", err);
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 pb-20 w-full max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ee6a2c] flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Social Media &amp; Footer Branding
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-medium pl-13">
          Manage the header emblem and brand lines, footer logo, secretariat contact details,
          centralized social media links and footer text.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#ee6a2c] animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading brand &amp; footer settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-8 w-full">
          {/* Section 1: Logos & Branding */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#ee6a2c] flex items-center justify-center font-bold">
                <ImageIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  1. Website Branding &amp; Logos
                </h3>
                <p className="text-xs text-gray-500">
                  Header emblem (dark and white versions), the two-line name beside it, and the full
                  logo used in the footer and intro splash.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Header Brand Line 1"
                value={footer.headerBrandLine1}
                onChange={(e) => setF("headerBrandLine1", e.target.value)}
                placeholder="e.g. Indian Chamber of"
                helperText="First line of the name beside the header emblem."
              />
              <InputField
                label="Header Brand Line 2"
                value={footer.headerBrandLine2}
                onChange={(e) => setF("headerBrandLine2", e.target.value)}
                placeholder="e.g. Construction Industry"
                helperText="Second line of the name beside the header emblem."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ee6a2c]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Header Emblem (scrolled / white header)
                  </span>
                </div>
                <ImagePickerField
                  label="Emblem — Dark Ink"
                  value={logoMark}
                  onChange={setLogoMark}
                  folder="icci/brand"
                  placeholder="/logo/icci-mark.webp"
                  helperText="Shown once the header turns white on scroll."
                />
              </div>

              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ee6a2c]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Header Emblem (over hero photos)
                  </span>
                </div>
                <ImagePickerField
                  label="Emblem — White Ink"
                  value={logoMarkWhite}
                  onChange={setLogoMarkWhite}
                  folder="icci/brand"
                  placeholder="/logo/icci-mark-white.webp"
                  helperText="Shown while the header is transparent over a photo."
                />
              </div>

              <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dfae19]" />
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Footer &amp; Splash Logo
                  </span>
                </div>
                <ImagePickerField
                  label="Full Logo (emblem, name & tagline)"
                  value={logo}
                  onChange={setLogo}
                  folder="icci/brand"
                  placeholder="/logo/icci-logo.webp"
                  helperText="Displayed in the footer brand column and on the intro splash screen."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Emblem Alt Text"
                value={footer.logoMarkAlt}
                onChange={(e) => setF("logoMarkAlt", e.target.value)}
                placeholder="e.g. ICCI emblem"
              />
              <InputField
                label="Full Logo Alt Text"
                value={footer.logoAlt}
                onChange={(e) => setF("logoAlt", e.target.value)}
                placeholder="e.g. Organisation name – tagline"
              />
            </div>
          </div>

          {/* Section 2: Footer Details & Contact Information */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#dfae19] flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  2. Footer Details &amp; Contact
                </h3>
                <p className="text-xs text-gray-500">
                  Secretariat address, phone and email (footer &quot;Reach Us&quot; column and the
                  Contact page), footer headings and copyright.
                </p>
              </div>
            </div>

            <TextAreaField
              label="Secretariat Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              placeholder="e.g. 3rd Floor, PHD House, New Delhi"
              helperText="Shown in the footer and on the Contact page."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 00000 00000"
              />
              <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. contact@icci.co.in"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                label="'Follow Us' Label"
                value={footer.followUsLabel}
                onChange={(e) => setF("followUsLabel", e.target.value)}
                placeholder="e.g. Follow Us"
              />
              <InputField
                label="Links Column Title"
                value={footer.quickLinksTitle}
                onChange={(e) => setF("quickLinksTitle", e.target.value)}
                placeholder="e.g. Quick Links"
              />
              <InputField
                label="Contact Column Title"
                value={footer.reachUsTitle}
                onChange={(e) => setF("reachUsTitle", e.target.value)}
                placeholder="e.g. Reach Us"
              />
            </div>

            <InputField
              label="Footer Copyright Notice"
              value={footer.copyrightText}
              onChange={(e) => setF("copyrightText", e.target.value)}
              placeholder="e.g. Organisation name. All rights reserved."
              helperText="Rendered as: © <current year> <this text>, in the bottom bar of the footer."
            />
          </div>

          {/* Section 3: Centralized Social Media Channels */}
          <div className="w-full border border-gray-100 rounded-3xl bg-white p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            <div className="flex items-center gap-3.5 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Share2 size={20} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  3. Centralized Social Media Profiles
                </h3>
                <p className="text-xs text-gray-500">
                  Single source of truth for all social channels displayed across the entire website.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#ee6a2c] shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-[#ee6a2c]">Centralized Hub: </span>
                The coloured tabs on the left edge of every page and the footer icons read directly
                from these links. Leave a field empty to hide that network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {NETWORKS.map((n) => (
                <div key={n.key} className="space-y-1">
                  <InputField
                    label={n.title}
                    value={urls[n.key]}
                    onChange={(e) => setUrls((p) => ({ ...p, [n.key]: e.target.value }))}
                    placeholder={n.ph}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Full-Width Save Bar at Bottom */}
          <div className="sticky bottom-4 z-20 pt-3 pb-1 bg-white/95 backdrop-blur-md border-t border-gray-100 w-full rounded-2xl shadow-xs">
            <SaveButton
              loading={saving}
              saved={saved}
              type="submit"
              label="Save All Social Media & Brand Settings"
              className="w-full py-4 text-sm font-bold shadow-md hover:shadow-lg"
            />
          </div>
        </form>
      )}
    </section>
  );
}
