import TravelerPassportMapPage from "../traveler/passport-map/page";

export const metadata = {
  title: "Siargao Passport Map | One Siargao Pass",
  description:
    "Siargao Passport Map helps travelers follow Passport Trails, view verified stops, and continue their Siargao journey through One Siargao Pass.",
};

export default async function PublicSiargaoPassportMapPage() {
  return <TravelerPassportMapPage />;
}
