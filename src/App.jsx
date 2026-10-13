import React from 'react';
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

export default function App() {
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
