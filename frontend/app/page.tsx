import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import Timeline from "@/components/Timeline";
import Landing from "@/components/Landing";
import Reveal from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Header intro />
      <main>
        <Hero />
        <Reveal waitFor={2900}>
          <Process />
        </Reveal>
        <Reveal>
          <Timeline />
        </Reveal>
        <Reveal>
          <Landing />
        </Reveal>
      </main>
    </>
  );
}