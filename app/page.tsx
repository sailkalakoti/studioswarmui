import { LandingPage } from "@/components/landing-page";

import "@radix-ui/themes/styles.css";
import { redirect } from "next/navigation";
export default function Home() {
  redirect('/dashboard');
  return <LandingPage />;
}
