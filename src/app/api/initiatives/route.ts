import { createPageRouteHandlers } from "@/lib/page-route-factory";

const { GET, PUT } = createPageRouteHandlers("initiatives", "Initiatives");
export { GET, PUT };
