import { redirect } from "next/navigation";

/**
 * The listening question types are now shown on the main /practice page
 * via the Listening tab. Redirect anyone who hits this URL directly.
 */
export default function ListeningPage() {
  redirect("/practice");
}
