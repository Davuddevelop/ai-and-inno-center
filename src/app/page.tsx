import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Manifesto } from "@/components/landing/Manifesto";
import { Programs } from "@/components/landing/Programs";
import { Gazette } from "@/components/landing/Gazette";
import { Leadership } from "@/components/landing/Leadership";
import { JoinBand } from "@/components/landing/JoinBand";
import { Footer } from "@/components/landing/Footer";

// Public content, read with the cookie-free client, so this page stays
// cacheable instead of rendering per request. Publishing from /admin/gazette
// calls revalidatePath, so a new post appears immediately rather than after
// this window.
export const revalidate = 300;


export default function Home() {
  return (
    <div className="grain flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Manifesto />
        <Programs />
        <Gazette />
        <Leadership />
        <JoinBand />
      </main>
      <Footer />
    </div>
  );
}
