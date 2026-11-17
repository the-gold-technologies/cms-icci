import globalSeed from "../../prisma/global-seed.json";

/** Default ICCI header links (website lib/content.ts `nav` + "Become a Member" button). */
export const DEFAULT_NAV_LINKS: {
  id: string;
  label: string;
  url: string;
  type: string;
  parent: string;
  order: number;
  description?: string | null;
  image?: string | null;
}[] = globalSeed.navLinks;
