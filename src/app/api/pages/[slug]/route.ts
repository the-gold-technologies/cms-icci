import { createPageRouteHandlers } from "@/lib/page-route-factory";
import { SITE_PAGES } from "@/lib/site-pages";

// The single content endpoint for every static page: section editors save here and the website reads here.
type Params = { params: Promise<{ slug: string }> };

async function handlersFor({ params }: Params) {
  const { slug } = await params;
  const title = SITE_PAGES.find((p) => p.slug === slug)?.title ?? slug;
  return createPageRouteHandlers(slug, title);
}

export async function GET(_req: Request, ctx: Params) {
  return (await handlersFor(ctx)).GET();
}

export async function PUT(req: Request, ctx: Params) {
  return (await handlersFor(ctx)).PUT(req);
}
