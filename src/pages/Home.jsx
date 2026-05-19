import { useState } from 'react';
import Nav from '../components/Nav';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import AboutSection from '../components/AboutSection';
import PortfolioSection from '../components/PortfolioSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import FooterSection from '../components/FooterSection';
import QuizModal from '../components/QuizModal';

export default function Home() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div style={{ background: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
      <Nav onOpenQuiz={() => setQuizOpen(true)} />
      <HeroSection onOpenQuiz={() => setQuizOpen(true)} />
      <StatsBar />
      <AboutSection />
      <PortfolioSection onOpenQuiz={() => setQuizOpen(true)} />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection onOpenQuiz={() => setQuizOpen(true)} />
      <FooterSection />
      <QuizModal isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}