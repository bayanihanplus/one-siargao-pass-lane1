import { redirect } from "next/navigation";

export default function TravelerAssistantAliasPage() {
  redirect("/traveler/settings?panel=assistant");
}
