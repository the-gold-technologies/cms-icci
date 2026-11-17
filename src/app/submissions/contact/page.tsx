import { SubmissionsTable } from "../components/SubmissionsTable";

export default function ContactSubmissionsPage() {
  return (
    <SubmissionsTable
      formType="contact"
      title="Contact Enquiries"
      description="Messages sent through the 'Send us an enquiry' form on the Contact page."
    />
  );
}
