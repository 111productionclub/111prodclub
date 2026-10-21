import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Process from "@/components/Process"
import Timeline from "@/components/Timeline";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Process />
        <Timeline />
      </main>
    </>

  );
}