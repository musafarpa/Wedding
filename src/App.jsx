import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplashScreen from './components/SplashScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StoryTimeline from './components/StoryTimeline';
import InvitationCard3D from './components/InvitationCard3D';
import CelebrationsSection from './components/CelebrationsSection';
import VenueSection from './components/VenueSection';
import CountdownRsvpSection from './components/CountdownRsvpSection';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  // Single shared Lenis instance for the entire application
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.4,
      smoothWheel: true,
      autoToggle: false,
    });
    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => {
      try {
        lenis.raf(time * 1000);
      } catch {
        // safeguard
      }
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <div className="wedding-journey-app">
      <SplashScreen />
      <Navbar />
      <HeroSection />
      <StoryTimeline />
      <InvitationCard3D />
      <CelebrationsSection />
      <VenueSection />
      <CountdownRsvpSection />
      <Footer />
      <AudioPlayer />
    </div>
  );
}
