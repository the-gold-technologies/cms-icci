import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("news-and-articles", "News & Articles");
export { GET, PUT };
