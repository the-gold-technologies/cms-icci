import { SubmissionsTable } from "../components/SubmissionsTable";

export default function MembershipSubmissionsPage() {
  return (
    <SubmissionsTable
      formType="membership"
      title="Membership Enquiries"
      description="Applications sent through the Membership Enquiry form (home page and Membership page)."
    />
  );
}
