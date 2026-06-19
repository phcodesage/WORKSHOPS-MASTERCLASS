"use client";

import { Calendar, MapPin, Building2, Users, BrainCircuit, Rocket, Handshake, Globe, Megaphone, ChevronRight } from 'lucide-react';
import Lenis from 'lenis';
import { useState, useEffect, useRef } from 'react';
import PaymentModal, { calcCardPrice } from '../PaymentModal';

// Workshop images
import trainYourBrainImg from '../images/train-your-brain.jpg';
import lifeLongLearningImg from '../images/life-long-learning.jpg';
import mindMappingImg from '../images/mind-mapping.png';
import focusAndFlowImg from '../images/focus-and-flow.png';
import memoryMagicImg from '../images/memory-magic.png';
import limitlessMasterclassImg from '../images/limitless-masterclass.jpg';




const FEATURE_ICONS: Record<string, any> = {
  network: Users,
  discover: BrainCircuit,
  grow: Rocket,
  build: Handshake,
};

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [dynamicWorkshops, setDynamicWorkshops] = useState<any[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const DEFAULT_STRIPE_LINK = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=cd5960dd-5302-11f1-a8e1-12a0879a85b1';

  function openPayment(workshop: any) {
    setSelectedWorkshop(workshop);
    setPaymentModalOpen(true);
  }

  useEffect(() => {
    fetch('/api/analytics', { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchContentAndImages = async () => {
      try {
        const res = await fetch('/api/content');
        const content = await res.json();
        
        if (!Array.isArray(content)) {
          console.error("Failed to load content:", content);
          return;
        }

        setDynamicWorkshops(content);

        const updated = await Promise.all(content.map(async (w: any) => {
          if (w.image?.src || w.imageUrl) return { ...w, image: { src: w.imageUrl || w.image.src } };
          try {
            const pxRes = await fetch(`/api/pexels?query=${encodeURIComponent(w.searchQuery || w.title)}`);
            if (pxRes.ok) {
              const data = await pxRes.json();
              if (data.imageUrl) {
                return { ...w, image: { src: data.imageUrl } };
              }
            }
          } catch (e) {}
          return w;
        }));
        setDynamicWorkshops(updated);
      } catch(err) {}
    };
    fetchContentAndImages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 300);

      const sections = document.querySelectorAll('.workshop-section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const element = section as HTMLElement;
        if (scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const lenis = new Lenis();
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.workshop-section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        courseName={selectedWorkshop ? selectedWorkshop.title : 'Workshop'}
        cashPrice={selectedWorkshop?.price || '$47'}
        cardPrice={calcCardPrice(selectedWorkshop?.price || '$47')}
        cardPaymentLink={selectedWorkshop?.registrationUrl || DEFAULT_STRIPE_LINK}
        invoiceNumber={selectedWorkshop?.invoiceNumber || 'Workshop'}
      />
      <nav className="fixed top-0 left-0 right-0 bg-[#0e1f3e] text-white z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={scrollToTop}
              role="button"
              aria-label="Scroll to top"
            >
              <img
                src="/exceed-new-logo-2026.png"
                alt="Exceed Learning Center"
                width={120} height={32}
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold font-display">WORKSHOPS & MASTERCLASS</h1>
            </div>
            <div className="hidden lg:flex space-x-6">
              {Array.isArray(dynamicWorkshops) && dynamicWorkshops.map((workshop: any, index: number) => (
                <button
                  key={workshop.id}
                  onClick={() => scrollToSection(index)}
                  className={`text-sm hover:text-[#ca3433] transition-colors ${activeSection === index ? 'text-[#ca3433] font-semibold' : ''
                    }`}
                >
                  {workshop.date.split('•')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {Array.isArray(dynamicWorkshops) && dynamicWorkshops.map((workshop: any, index: number) => {
        const isMasterclass = workshop.type === 'Masterclass';
        const isSummit = workshop.type === 'Summit';
        const isCyberpunk = isSummit && workshop.theme === 'cyberpunk';

        if (isCyberpunk) {
          const [datePart, timePart] = (workshop.date || '').split('•').map((s: string) => s.trim());
          const tierAccents = [
            { ring: 'border-[#00e5ff]', glow: 'shadow-[0_0_25px_rgba(0,229,255,0.35)]', text: 'text-[#00e5ff]', dot: 'bg-[#00e5ff]' },
            { ring: 'border-[#7b2cbf]', glow: 'shadow-[0_0_25px_rgba(123,44,191,0.3)]', text: 'text-[#b794f4]', dot: 'bg-[#7b2cbf]' },
            { ring: 'border-[#f72585]', glow: 'shadow-[0_0_25px_rgba(247,37,133,0.3)]', text: 'text-[#f72585]', dot: 'bg-[#f72585]' },
          ];

          return (
            <section
              key={workshop.id}
              id={workshop.id}
              className="workshop-section relative flex items-center justify-center overflow-hidden py-16 md:py-20 bg-[#050410]"
            >
              {/* Cityscape Background (Right Side Only - Desktop Only) */}
              <div className="absolute top-0 right-0 lg:w-[50%] h-[600px] md:h-[700px] pointer-events-none hidden lg:block">
                <div 
                  className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-60" 
                  style={{ backgroundImage: 'url(/summit-images/ai-summit-bg.jpg)' }} 
                />
                {/* Horizontal gradient to blend the left side on desktop */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050410] via-[#050410]/20 to-transparent" />
                {/* Vertical gradient to fade out at the bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050410]/30 via-transparent to-[#050410]" />
              </div>

              {/* Background grid + glows */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)',
                    backgroundSize: '46px 46px',
                    maskImage: 'radial-gradient(ellipse at 70% 30%, black 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 70% 30%, black 0%, transparent 70%)',
                  }}
                />
                <div className="absolute -top-20 right-10 w-[28rem] h-[28rem] rounded-full bg-[#7b2cbf] opacity-20 blur-[120px]" />
                <div className="absolute top-1/3 -left-20 w-96 h-96 rounded-full bg-[#00e5ff] opacity-10 blur-[120px]" />
                <div className="absolute bottom-0 left-1/3 w-[30rem] h-72 rounded-full bg-[#f72585] opacity-10 blur-[120px]" />
              </div>

              <div className="container mx-auto px-4 md:px-6 z-10 max-w-6xl">
                {/* ===== HERO ===== */}
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center mb-12 md:mb-16">
                  {/* Left: copy + info */}
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    {/* Eyebrow */}
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-5 w-full">
                      <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#00e5ff]" />
                      <span className="text-[#7df9ff] text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                        {workshop.eyebrow || 'Connect. Learn. Innovate. Elevate.'}
                      </span>
                      <span className="h-px w-8 lg:flex-1 bg-gradient-to-l lg:bg-gradient-to-r from-transparent lg:from-[#00e5ff]/60 to-[#00e5ff] lg:to-transparent" />
                    </div>

                    {/* Title */}
                    <h2 className="font-display font-extrabold leading-none uppercase tracking-tight mb-5">
                      <span className="block text-5xl md:text-7xl lg:text-8xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#7df9ff] to-[#00b8ff] drop-shadow-[0_0_25px_rgba(0,229,255,0.5)]">AI</span>
                        <span className="text-white"> SUMMIT</span>
                      </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-300/90 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                      {workshop.subtitle}
                    </p>

                    {/* Info rows */}
                    <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
                      <div className="flex items-center gap-4 text-left">
                        <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#0e1f3e]/80 border border-[#00e5ff]/50 shadow-[0_0_18px_rgba(0,229,255,0.25)]">
                          <Calendar className="w-5 h-5 text-[#00e5ff]" />
                        </span>
                        <div>
                          <div className="text-white font-bold tracking-wide uppercase text-sm md:text-base">{datePart}</div>
                          {timePart && <div className="text-[#00e5ff] text-xs md:text-sm font-semibold">{timePart}</div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-left">
                        <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#0e1f3e]/80 border border-[#7b2cbf]/60 shadow-[0_0_18px_rgba(123,44,191,0.25)]">
                          <MapPin className="w-5 h-5 text-[#b794f4]" />
                        </span>
                        <div className="text-white font-bold tracking-wide uppercase text-sm md:text-base">
                          LOCATION <span className="text-[#f72585]">{(workshop.location || 'LOCATION TBD').replace(/^location\s*/i, '') || 'TBD'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-left">
                        <span className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[#0e1f3e]/80 border border-[#f72585]/50 shadow-[0_0_18px_rgba(247,37,133,0.25)]">
                          <Building2 className="w-5 h-5 text-[#f72585]" />
                        </span>
                        <div className="text-white font-bold tracking-wide uppercase text-sm md:text-base">{workshop.experience || 'The Experience'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: holographic AI visual SVG */}
                  <div className="relative w-full h-[320px] md:h-[420px] flex items-center justify-center z-10">
                    <svg 
                      viewBox="0 0 320 380" 
                      className="w-full h-full max-h-[380px] md:max-h-[420px] drop-shadow-[0_0_20px_rgba(0,229,255,0.25)]"
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="5" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                          <feGaussianBlur stdDeviation="7" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="glow-heavy-cyan" x="-40%" y="-40%" width="180%" height="180%">
                          <feGaussianBlur stdDeviation="10" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id="beam-grad" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.45" />
                          <stop offset="35%" stopColor="#7b2cbf" stopOpacity="0.2" />
                          <stop offset="85%" stopColor="#050410" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="ai-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="40%" stopColor="#e3faff" />
                          <stop offset="100%" stopColor="#00e5ff" />
                        </linearGradient>
                        <style>
                          {`
                            @keyframes float-particle {
                              0% { transform: translateY(15px); opacity: 0; }
                              30% { opacity: 0.8; }
                              70% { opacity: 0.8; }
                              100% { transform: translateY(-45px); opacity: 0; }
                            }
                            @keyframes hologram-pulse {
                              0%, 100% { opacity: 0.35; }
                              50% { opacity: 0.65; }
                            }
                            @keyframes text-glow {
                              0%, 100% { filter: drop-shadow(0 0 8px rgba(0,229,255,0.7)); }
                              50% { filter: drop-shadow(0 0 20px rgba(0,229,255,0.95)) drop-shadow(0 0 35px rgba(123,44,191,0.5)); }
                            }
                            @keyframes ring-rotate-clockwise {
                              0% { transform: rotate(0deg); transform-origin: 160px 320px; }
                              100% { transform: rotate(360deg); transform-origin: 160px 320px; }
                            }
                            @keyframes ring-rotate-counter {
                              0% { transform: rotate(360deg); transform-origin: 160px 320px; }
                              100% { transform: rotate(0deg); transform-origin: 160px 320px; }
                            }
                            .particle-1 { animation: float-particle 4.5s infinite linear; }
                            .particle-2 { animation: float-particle 6s infinite linear 1.5s; }
                            .particle-3 { animation: float-particle 5.2s infinite linear 3s; }
                            .beam-light { animation: hologram-pulse 4s infinite ease-in-out; }
                            .ai-text-glow { animation: text-glow 4s infinite ease-in-out; }
                            .ring-c { animation: ring-rotate-clockwise 25s infinite linear; }
                            .ring-cc { animation: ring-rotate-counter 20s infinite linear; }
                          `}
                        </style>
                      </defs>

                      {/* --- LIGHT BEAM --- */}
                      <polygon 
                        points="70,80 250,80 210,320 110,320" 
                        fill="url(#beam-grad)" 
                        className="beam-light"
                      />

                      {/* --- HOLOGRAPHIC BG GRID/DETAILS --- */}
                      <g stroke="#00e5ff" strokeWidth="0.8" opacity="0.3" filter="url(#glow-cyan)">
                        <line x1="160" y1="120" x2="160" y2="320" strokeDasharray="3 3" />
                        <line x1="115" y1="180" x2="205" y2="180" strokeDasharray="2 4" />
                        <line x1="90" y1="240" x2="230" y2="240" strokeDasharray="2 4" />
                      </g>

                      {/* --- FLOATING PARTICLES --- */}
                      <g filter="url(#glow-cyan)">
                        {/* Column 1 */}
                        <circle cx="120" cy="180" r="2" fill="#00e5ff" className="particle-1" />
                        <circle cx="210" cy="140" r="1.5" fill="#00e5ff" className="particle-2" />
                        <circle cx="150" cy="220" r="2.5" fill="#7b2cbf" className="particle-3" />
                        
                        {/* Column 2 */}
                        <circle cx="180" cy="170" r="1.5" fill="#f72585" className="particle-1" style={{ animationDelay: '0.8s' }} />
                        <circle cx="105" cy="130" r="2" fill="#00e5ff" className="particle-3" style={{ animationDelay: '1.2s' }} />
                        <circle cx="200" cy="200" r="1.2" fill="#00e5ff" className="particle-2" style={{ animationDelay: '2.5s' }} />
                        
                        {/* Column 3 */}
                        <circle cx="140" cy="110" r="2.2" fill="#00e5ff" className="particle-2" style={{ animationDelay: '0.4s' }} />
                        <circle cx="165" cy="150" r="1.5" fill="#7b2cbf" className="particle-1" style={{ animationDelay: '2.2s' }} />
                        <circle cx="225" cy="115" r="2" fill="#00e5ff" className="particle-3" style={{ animationDelay: '0.6s' }} />
                      </g>

                      {/* --- CIRCUIT CONNECTORS (BACKGROUND TO TEXT) --- */}
                      <g stroke="#00e5ff" strokeWidth="1" fill="none" opacity="0.5" filter="url(#glow-cyan)">
                        <path d="M125,270 L125,230 L105,210" />
                        <circle cx="105" cy="210" r="2" fill="#00e5ff" />
                        
                        <path d="M195,270 L195,240 L215,220" />
                        <circle cx="215" cy="220" r="2" fill="#00e5ff" />
                        
                        <path d="M90,170 L110,150 L210,150 L230,170" />
                        <circle cx="90" cy="170" r="1.5" fill="#00e5ff" />
                        <circle cx="230" cy="170" r="1.5" fill="#00e5ff" />
                      </g>

                      {/* --- CENTRAL HOLOGRAPHIC "AI" TEXT --- */}
                      <text 
                        x="160" 
                        y="200" 
                        textAnchor="middle" 
                        fontFamily="Montserrat, Inter, system-ui, sans-serif" 
                        fontWeight="900" 
                        fontSize="94" 
                        fill="url(#ai-grad)" 
                        stroke="#00e5ff" 
                        strokeWidth="1.5"
                        letterSpacing="-0.04em"
                        className="ai-text-glow"
                      >
                        AI
                      </text>

                      {/* Circuit details drawn over the text for tech aesthetic */}
                      <g stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.8" filter="url(#glow-cyan)">
                        <path d="M132,150 L140,165 M188,150 L180,165" />
                        <circle cx="140" cy="165" r="1" fill="#ffffff" />
                        <circle cx="180" cy="165" r="1" fill="#ffffff" />
                      </g>

                      {/* --- BASE PEDESTAL (ELLIPSES) --- */}
                      <g className="ring-c">
                        {/* Outer Glow Ring */}
                        <ellipse cx="160" cy="320" rx="95" ry="19" stroke="#7b2cbf" strokeWidth="2.5" opacity="0.8" filter="url(#glow-purple)" strokeDasharray="30 10 15 5" />
                      </g>
                      <g className="ring-cc">
                        {/* Inner Bright Ring */}
                        <ellipse cx="160" cy="320" rx="78" ry="16" stroke="#00e5ff" strokeWidth="3" filter="url(#glow-cyan)" strokeDasharray="50 15 10 15" />
                      </g>
                      
                      {/* Innermost pulsing light center */}
                      <ellipse cx="160" cy="320" rx="55" ry="11" stroke="#f72585" strokeWidth="1.5" opacity="0.6" strokeDasharray="5 5" />
                      <ellipse cx="160" cy="320" rx="35" ry="7" fill="#00e5ff" fillOpacity="0.25" filter="url(#glow-heavy-cyan)" />
                    </svg>
                  </div>
                </div>

                {/* ===== EXCLUSIVE PRESALE ===== */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#7b2cbf]" />
                  <h3 className="text-white text-sm md:text-lg font-bold tracking-[0.3em] uppercase">{workshop.presaleLabel || 'Exclusive Presale'}</h3>
                  <span className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#7b2cbf]" />
                </div>

                {/* Pricing tiers */}
                <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 sm:gap-2 md:gap-4 mb-14">
                  {(workshop.pricingTiers || []).map((tier: any, i: number) => {
                    const a = tierAccents[i] || tierAccents[0];
                    const TierIcon = i === 0 ? Users : Calendar;

                    return (
                      <div key={i} className="flex items-stretch sm:items-center gap-4 sm:gap-2 md:gap-4 mt-5">
                        <button
                          onClick={() => openPayment({ ...workshop, price: tier.price })}
                          className={`group relative text-center bg-white/[0.04] backdrop-blur-sm border ${a.ring} ${a.glow} rounded-2xl px-6 pt-9 pb-6 w-full sm:w-44 md:w-52 flex flex-col items-center transition-all duration-300 hover:bg-white/[0.08] hover:scale-[1.03]`}
                        >
                          {/* Circular badge overlapping top border */}
                          <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0a0820] border-2 ${a.ring} flex items-center justify-center shadow-lg z-10`}>
                            <TierIcon className={`w-5 h-5 ${a.text}`} />
                          </div>

                          <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 mt-2 ${a.text}`}>
                            {tier.window || tier.name}
                          </span>
                          <span className="text-white font-display font-extrabold text-4xl md:text-5xl leading-none mb-1">{tier.price}</span>
                          {tier.description && (
                            <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wide mt-1">{tier.description}</span>
                          )}
                          <span className={`mt-3 text-[10px] font-bold uppercase tracking-widest ${a.text} opacity-70 group-hover:opacity-100 transition-opacity`}>
                            Register →
                          </span>
                        </button>
                        {i < (workshop.pricingTiers.length - 1) && (
                          <ChevronRight className="hidden sm:block w-6 h-6 text-white/30 flex-shrink-0 self-center" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ===== Feature highlights ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 py-8 border-t border-white/10 mb-12">
                  {(workshop.features || []).map((f: any, i: number) => {
                    const Icon = FEATURE_ICONS[f.icon] || Users;
                    const isEven = i % 2 === 0;
                    const iconColor = isEven ? 'text-[#00e5ff]' : 'text-[#7b2cbf]';
                    const glowClass = isEven 
                      ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.75)]' 
                      : 'drop-shadow-[0_0_8px_rgba(123,44,191,0.75)]';

                    return (
                      <div 
                        key={i} 
                        className={`flex items-center gap-4 px-6 justify-start md:justify-center ${
                          i !== 0 ? 'md:border-l md:border-white/10' : ''
                        }`}
                      >
                        <Icon className={`w-12 h-12 flex-shrink-0 ${iconColor} ${glowClass}`} />
                        <div className="text-left font-display">
                          <h4 className="text-white font-extrabold text-sm md:text-base tracking-wider uppercase leading-none mb-1">
                            {f.title}
                          </h4>
                          <p className="text-gray-400 text-[10px] md:text-[11px] font-semibold tracking-wider uppercase leading-tight whitespace-pre-line">
                            {f.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ===== Bottom CTA bar ===== */}
                <div className="p-[1.5px] bg-gradient-to-r from-[#00e5ff] to-[#7b2cbf] rounded-2xl shadow-[0_0_35px_rgba(0,229,255,0.15)] mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-8 bg-[#0a0820]/95 backdrop-blur-md rounded-2xl py-6 px-8 md:px-10">
                    {/* Left block */}
                    <div className="flex items-center gap-4 md:gap-6 justify-start">
                      <Globe className="w-14 h-14 text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)] flex-shrink-0" />
                      <div className="text-left font-display">
                        <div className="text-white font-extrabold tracking-wide uppercase text-base md:text-lg leading-none">
                          BE PART OF THE FUTURE.
                        </div>
                        <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#00b8ff] font-black italic tracking-wider uppercase text-xl md:text-2xl mt-2 drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                          DON'T MISS IT!
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-12 bg-white/20 self-center" />

                    {/* Right block */}
                    <div className="flex items-center gap-4 md:gap-6 justify-start">
                      <Megaphone className="w-14 h-14 text-[#b794f4] drop-shadow-[0_0_10px_rgba(183,148,244,0.6)] flex-shrink-0" />
                      <div className="text-left font-display">
                        <div className="text-gray-200 font-extrabold tracking-wide uppercase text-base md:text-lg leading-none">
                          SPREAD THE WORD.
                        </div>
                        <div className="text-gray-400 font-bold tracking-wide uppercase text-sm md:text-base mt-2">
                          SHARE THE FUTURE.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll dots */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden lg:block">
                <div className="flex space-x-2">
                  {Array.isArray(dynamicWorkshops) && dynamicWorkshops.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${idx === index ? 'bg-[#00e5ff] w-8' : 'bg-white opacity-30'}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        }

        if (isSummit) {
          const themeColors = workshop.theme === 'cyberpunk' ? {
            primaryBg: 'bg-[#00e5ff]',
            primaryText: 'text-[#00e5ff]',
            primaryBorder: 'border-[#00e5ff]',
            buttonBg: 'bg-gradient-to-r from-[#00e5ff] to-[#7b2cbf]',
            buttonHover: 'hover:opacity-90 hover:scale-105',
            blurOne: 'bg-[#00e5ff]',
            blurTwo: 'bg-[#7b2cbf]',
            gradientStart: 'from-[#0e1f3e]',
            gradientEnd: 'to-[#1a0a0a]',
            iconBg: 'bg-[#0e1f3e]',
            iconBorder: 'border-[#00e5ff]'
          } : {
            primaryBg: 'bg-[#ca3433]',
            primaryText: 'text-[#ca3433]',
            primaryBorder: 'border-[#ca3433]',
            buttonBg: 'bg-[#ca3433]',
            buttonHover: 'hover:bg-red-700 hover:scale-105',
            blurOne: 'bg-[#ca3433]',
            blurTwo: 'bg-[#ca3433]',
            gradientStart: 'from-[#ca3433]',
            gradientEnd: 'to-[#0e1f3e]',
            iconBg: 'bg-gradient-to-br from-[#ca3433] to-[#0e1f3e]',
            iconBorder: 'border-[#ca3433]'
          };

          return (
            <section
              key={workshop.id}
              id={workshop.id}
              className="workshop-section min-h-screen flex items-center justify-center relative py-20 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0e1f3e 50%, #1a0a0a 100%)' }}
            >
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className={`absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl ${themeColors.blurOne}`}></div>
                <div className={`absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl ${themeColors.blurTwo}`}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
              </div>

              <div className="container mx-auto px-4 md:px-6 z-10 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10">
                  <div className={`inline-block text-white text-xs font-bold tracking-widest uppercase px-4 py-1 rounded mb-4 ${themeColors.primaryBg}`}>
                    {workshop.type}
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display text-white leading-tight mb-3 uppercase">
                    {workshop.title === 'AI Summit' ? (
                      <>
                        <span className="text-[#00e5ff]">AI</span> SUMMIT
                      </>
                    ) : (
                      workshop.title
                    )}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 tracking-widest uppercase mb-4">
                    {workshop.subtitle}
                  </p>
                  <div className={`flex items-center justify-center space-x-2 mb-2 ${themeColors.primaryText}`}>
                    <Calendar className="w-5 h-5" />
                    <span className="text-base md:text-lg font-bold">{workshop.date}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {workshop.location ? (
                      <>
                        at: <span className="text-white font-semibold">{workshop.location}</span>
                      </>
                    ) : (
                      <>
                        at: <span className="text-white font-semibold">Exceed Learning Center</span>{' '}
                        <span className="italic">• 1360 Willis Ave, Albertson, NY</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Speakers grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {(workshop.speakers || []).map((speaker: any, i: number) => (
                    <div key={i} className={`bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all`}>
                      {/* Speaker image */}
                      <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full border-2 mb-3 overflow-hidden flex items-center justify-center ${themeColors.iconBg} ${themeColors.iconBorder}`}>
                        {workshop.speakerImages?.[i] ? (
                          <img src={workshop.speakerImages[i]} alt={speaker.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <span className={`text-2xl font-bold opacity-60 ${themeColors.primaryText}`}>{speaker.name.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-sm md:text-base leading-tight mb-1">{speaker.name}</h3>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${themeColors.primaryText}`}>{speaker.role}</p>
                      <p className="text-gray-400 text-xs leading-snug">
                        <span className="text-gray-500 uppercase text-[10px] tracking-wider block mb-1">Topic:</span>
                        {speaker.topic}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tagline + CTA */}
                <div className="text-center">
                  {workshop.tagline && (
                    <div className="inline-flex items-center gap-2 border border-white/20 rounded-lg px-5 py-2 text-white text-sm font-semibold tracking-wide mb-6">
                      📈 {workshop.tagline}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span>📅</span>
                      <span>Whole Day Event</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span>📍</span>
                      <span>Exceed Learning Center</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <span>🕘</span>
                      <span>9:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    {workshop.pricingTiers ? (
                      <div className="flex flex-wrap justify-center gap-4">
                        {workshop.pricingTiers.map((tier: any, i: number) => {
                          let tierBorder = 'border-white/20';
                          if (workshop.theme === 'cyberpunk') {
                            if (i === 0) tierBorder = 'border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)]';
                            else if (i === 1) tierBorder = 'border-[#7b2cbf]';
                            else tierBorder = 'border-[#f72585]';
                          }

                          return (
                            <div key={i} className={`bg-white/5 p-5 rounded-xl border ${tierBorder} text-center min-w-[220px] flex flex-col h-full relative overflow-hidden`}>
                              <h4 className="text-white font-bold mb-1 z-10">{tier.name}</h4>
                              <div className={`text-3xl font-bold mb-4 z-10 ${workshop.theme === 'cyberpunk' ? 'text-white' : themeColors.primaryText}`}>{tier.price}</div>
                              <div className="flex-grow"></div>
                              <button
                                onClick={() => openPayment({ ...workshop, price: tier.price })}
                                className={`w-full text-white px-4 py-3 text-sm font-bold rounded-lg transition-all shadow-lg z-10 ${themeColors.buttonBg} ${themeColors.buttonHover}`}
                              >
                                REGISTER
                              </button>
                              {tier.description && <p className="text-gray-400 text-xs mt-3 z-10">{tier.description}</p>}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-white">
                          {workshop.price}
                        </div>
                        <button
                          onClick={() => openPayment(workshop)}
                          className={`text-white px-10 py-4 text-lg font-bold rounded-lg transition-all duration-300 shadow-lg ${themeColors.buttonBg} ${themeColors.buttonHover}`}
                        >
                          REGISTER NOW — CHOOSE PAYMENT
                        </button>
                      </>
                    )}
                    <p className="text-gray-500 text-xs mt-2">Join us for a day of insight, strategy, and connection.</p>
                  </div>
                </div>
              </div>

              {/* Scroll dots */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
                <div className="flex space-x-2">
                  {Array.isArray(dynamicWorkshops) && dynamicWorkshops.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${idx === index ? 'bg-[#ca3433] w-8' : 'bg-white opacity-30'}`}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        }

        return (
          <section
            key={workshop.id}
            id={workshop.id}
            className={`workshop-section h-screen flex items-center justify-center relative overflow-y-auto py-16 md:py-8`}
            style={{
              backgroundColor: index % 2 === 0 ? '#f7e0e0' : 'white'
            }}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#ca3433]"></div>
              <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[#0e1f3e]"></div>
              <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[#ca3433]"></div>
              {isMasterclass && (
                <>
                  <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-[#0e1f3e]"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-32 h-32 rounded-full bg-[#ca3433]"></div>
                </>
              )}
            </div>

            <div className={`container mx-auto px-4 md:px-6 lg:px-12 z-10`}>
              <div className={`grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-12 items-center max-w-6xl mx-auto ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {index % 2 === 0 ? (
                  <>
                    <div className="relative">
                      <div className="relative group">
                        <div className={`absolute -inset-2 md:-inset-4 bg-[#ca3433] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                        <div className={`relative w-full max-w-[200px] md:max-w-[280px] lg:max-w-none mx-auto aspect-square lg:rounded-full rounded-2xl overflow-hidden border-4 lg:border-8 border-[#ca3433] shadow-2xl`}>
                          {workshop.image ? (
                            <img
                              src={workshop.image.src}
                              alt={workshop.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0e1f3e] via-[#1a3a5c] to-[#ca3433] flex items-center justify-center">
                              <div className="text-center text-white p-8">
                                <div className="text-4xl md:text-6xl lg:text-8xl font-display font-bold opacity-90 mb-2 md:mb-4">✨</div>
                                <p className="text-lg lg:text-xl font-display font-semibold opacity-80">Coming Soon</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="hidden lg:block absolute -left-8 top-0 w-1 h-full bg-[#ca3433]"></div>
                      <div className={`absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2 bg-[#ca3433] text-white px-4 py-2 md:px-6 md:py-3 w-max max-w-[90%] text-center rounded-lg lg:rounded-none`}>
                        <div className="flex items-center space-x-3 justify-center">
                          <div className="hidden lg:flex w-12 h-12 bg-white items-center justify-center">
                            <div className="w-8 h-1 bg-[#ca3433]"></div>
                          </div>
                          <span className={`font-bold text-sm md:text-lg`}>{workshop.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`space-y-2 md:space-y-4 lg:space-y-6 text-center lg:text-left`}>
                      <h2 className={`text-xl md:text-3xl lg:text-5xl font-bold font-display text-[#0e1f3e] leading-tight`}>
                        {workshop.title}
                      </h2>
                      {workshop.subtitle && (
                        <p className={`text-base md:text-xl lg:text-2xl text-[#ca3433] font-semibold`}>
                          {workshop.subtitle}
                        </p>
                      )}

                      <div className="flex items-center justify-center lg:justify-start space-x-2 md:space-x-3 text-[#ca3433]">
                        <Calendar className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8`} />
                        <span className={`text-base md:text-xl lg:text-2xl font-bold`}>{workshop.date}</span>
                      </div>

                      <div className={`pt-1 md:pt-4 lg:pt-6`}>
                        <p className={`text-xs md:text-base lg:text-lg text-[#0e1f3e]`}>
                          at: <span className="font-bold text-[#ca3433]">Exceed Learning Center</span> <span className="italic">• 1360 Willis Ave, Albertson, NY</span>
                        </p>
                      </div>

                      <div className={`pt-1 md:pt-4 flex flex-col items-center lg:items-start`}>
                        <p className={`text-xs md:text-sm lg:text-lg text-[#0e1f3e] mb-1 md:mb-2`}>For adults and young adults</p>
                        <button onClick={() => openPayment(workshop)} className={`block w-fit bg-[#ca3433] text-white px-5 py-2 md:px-8 md:py-4 text-sm md:text-xl font-semibold rounded-lg hover:bg-[#0e1f3e] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                          REGISTER NOW — CHOOSE PAYMENT
                        </button>
                      </div>

                      <div className={`pt-1 md:pt-4 lg:pt-6 text-center lg:text-left`}>
                        <p className={`text-xs md:text-sm lg:text-base text-[#0e1f3e]`}>adultsprograms@exceedlearningcenterny.com</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`space-y-2 md:space-y-4 lg:space-y-6 text-center lg:text-left order-2 lg:order-1`}>
                      <h2 className={`text-xl md:text-3xl lg:text-5xl font-bold font-display text-[#0e1f3e] leading-tight`}>
                        {workshop.title}
                      </h2>
                      {workshop.subtitle && (
                        <p className={`text-base md:text-xl lg:text-2xl text-[#ca3433] font-semibold`}>
                          {workshop.subtitle}
                        </p>
                      )}

                      <div className="flex items-center justify-center lg:justify-start space-x-2 md:space-x-3 text-[#ca3433]">
                        <Calendar className={`w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8`} />
                        <span className={`text-base md:text-xl lg:text-2xl font-bold`}>{workshop.date}</span>
                      </div>

                      <div className={`pt-1 md:pt-4 lg:pt-6`}>
                        <p className={`text-xs md:text-base lg:text-lg text-[#0e1f3e]`}>
                          at: <span className="font-bold text-[#ca3433]">Exceed Learning Center</span> <span className="italic">• 1360 Willis Ave, Albertson, NY</span>
                        </p>
                      </div>

                      <div className={`pt-1 md:pt-4 flex flex-col items-center lg:items-start`}>
                        <p className={`text-xs md:text-sm lg:text-lg text-[#0e1f3e] mb-1 md:mb-2`}>For adults and young adults</p>
                        <button onClick={() => openPayment(workshop)} className={`block w-fit bg-[#ca3433] text-white px-5 py-2 md:px-8 md:py-4 text-sm md:text-xl font-semibold rounded-lg hover:bg-[#0e1f3e] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                          REGISTER NOW — CHOOSE PAYMENT
                        </button>
                      </div>

                      <div className={`pt-1 md:pt-4 lg:pt-6 text-center lg:text-left`}>
                        <p className={`text-xs md:text-sm lg:text-base text-[#0e1f3e]`}>adultsprograms@exceedlearningcenterny.com</p>
                      </div>
                    </div>

                    <div className="relative order-1 lg:order-2">
                      <div className="relative group">
                        <div className={`absolute -inset-2 md:-inset-4 bg-[#ca3433] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                        <div className={`relative w-full max-w-[200px] md:max-w-[280px] lg:max-w-none mx-auto aspect-square lg:rounded-full rounded-2xl overflow-hidden border-4 lg:border-8 border-[#ca3433] shadow-2xl`}>
                          {workshop.image ? (
                            <img
                              src={workshop.image.src}
                              alt={workshop.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0e1f3e] via-[#1a3a5c] to-[#ca3433] flex items-center justify-center">
                              <div className="text-center text-white p-8">
                                <div className="text-4xl md:text-6xl lg:text-8xl font-display font-bold opacity-90 mb-2 md:mb-4">✨</div>
                                <p className="text-lg lg:text-xl font-display font-semibold opacity-80">Coming Soon</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="hidden lg:block absolute -right-8 top-0 w-1 h-full bg-[#ca3433]"></div>
                      <div className={`absolute -top-4 md:-top-6 left-1/2 transform -translate-x-1/2 bg-[#ca3433] text-white px-4 py-2 md:px-6 md:py-3 w-max max-w-[90%] text-center rounded-lg lg:rounded-none`}>
                        <div className="flex items-center space-x-3 justify-center">
                          <div className="hidden lg:flex w-12 h-12 bg-white items-center justify-center">
                            <div className="w-8 h-1 bg-[#ca3433]"></div>
                          </div>
                          <span className={`font-bold text-sm md:text-lg`}>{workshop.type}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
              <div className="flex space-x-2">
                {Array.isArray(dynamicWorkshops) && dynamicWorkshops.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${idx === index ? 'bg-[#ca3433] w-8' : 'bg-[#0e1f3e] opacity-30'
                      }`}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#ca3433] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#0e1f3e] hover:scale-110 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      <footer className="bg-[#0e1f3e] text-white">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/exceed-new-logo-2026.png"
              alt="Exceed Learning Center"
              width={160} height={40}
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold">Exceed Learning Center</span>
          </div>
          <div className="text-sm opacity-80 text-center md:text-right">
            <p>1360 Willis Ave, Albertson, NY</p>
            <p>adultsprograms@exceedlearningcenterny.com</p>
            <p>www.exceedlearningcenterny.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
