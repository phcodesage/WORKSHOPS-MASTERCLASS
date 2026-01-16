import { Calendar } from 'lucide-react';
import Lenis from 'lenis';
import { useState, useEffect } from 'react';

// Workshop images
import trainYourBrainImg from './images/train-your-brain.jpg';
import lifeLongLearningImg from './images/life-long-learning.jpg';
import mindMappingImg from './images/mind-mapping.png';
import focusAndFlowImg from './images/focus-and-flow.png';
import memoryMagicImg from './images/memory-magic.png';
import limitlessMasterclassImg from './images/limitless-masterclass.jpg';
import exceedLogo from './images/exceed-new-logo-2026.png';

const workshops = [
  {
    id: 'train-your-brain',
    date: 'Feb 2, 2026 • 6:00 PM',
    title: 'Train Your Brain',
    subtitle: 'Unlock Your Limitless Mind',
    type: 'Workshop',
    series: 'Limitless Growth Series',
    image: trainYourBrainImg
  },
  {
    id: 'lifelong-learning',
    date: 'Feb 4, 2026 • 6:00 PM',
    title: 'Life Long Learning',
    subtitle: 'How to Learn Anything Fast',
    type: 'Workshop',
    series: 'Limitless Growth Series',
    image: lifeLongLearningImg
  },
  {
    id: 'mind-mapping',
    date: 'Feb 11, 2026 • 6:00 PM',
    title: 'Mind Mapping & Mastery',
    subtitle: 'Visual Thinking for Success',
    type: 'Workshop',
    series: 'Limitless Growth Series',
    image: mindMappingImg
  },
  {
    id: 'focus-flow',
    date: 'Feb 17, 2026 • 6:00 PM',
    title: 'Focus & Flow',
    subtitle: 'The Science of Deep Work',
    type: 'Workshop',
    series: 'Limitless Growth Series',
    image: focusAndFlowImg
  },
  {
    id: 'memory-magic',
    date: 'Feb 25, 2026 • 6:00 PM',
    title: 'Memory Magic',
    subtitle: 'How to Remember Names, Numbers & More',
    type: 'Workshop',
    series: 'Limitless Growth Series',
    image: memoryMagicImg
  },
  {
    id: 'unlock-your-genius',
    date: 'Feb 8, 2026 • 10:00 AM - 3:00 PM',
    title: 'Limitless Masterclass: Unlock Your Genius',
    subtitle: 'The Art of Thinking Like a Visionary',
    type: 'Masterclass',
    image: limitlessMasterclassImg,
    registrationUrl: 'https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01'
  }
];

function App() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.workshop-section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative">
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
                src={exceedLogo}
                alt="Exceed Learning Center"
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold font-display">WORKSHOPS & MASTERCLASS</h1>
            </div>
            <div className="hidden lg:flex space-x-6">
              {workshops.map((workshop, index) => (
                <button
                  key={workshop.id}
                  onClick={() => scrollToSection(index)}
                  className={`text-sm hover:text-[#ca3433] transition-colors ${activeSection === index ? 'text-[#ca3433] font-semibold' : ''
                    }`}
                >
                  {workshop.date.split(':')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {workshops.map((workshop, index) => {
        const isMasterclass = workshop.type === 'Masterclass';
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
                              src={workshop.image}
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
                        <a href={workshop.registrationUrl || "https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01"} target="_blank" rel="noopener noreferrer" className={`block w-fit bg-[#ca3433] text-white px-5 py-2 md:px-8 md:py-4 text-sm md:text-xl font-semibold rounded-lg hover:bg-[#0e1f3e] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                          REGISTER NOW
                        </a>
                      </div>

                      <div className={`pt-1 md:pt-4 lg:pt-6 text-center lg:text-left`}>
                        <p className={`text-xs md:text-sm lg:text-base text-[#0e1f3e]`}>Adultclasses@exceedlearningcenterny.com</p>
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
                        <a href={workshop.registrationUrl || "https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01"} target="_blank" rel="noopener noreferrer" className={`block w-fit bg-[#ca3433] text-white px-5 py-2 md:px-8 md:py-4 text-sm md:text-xl font-semibold rounded-lg hover:bg-[#0e1f3e] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                          REGISTER NOW
                        </a>
                      </div>

                      <div className={`pt-1 md:pt-4 lg:pt-6 text-center lg:text-left`}>
                        <p className={`text-xs md:text-sm lg:text-base text-[#0e1f3e]`}>Adultclasses@exceedlearningcenterny.com</p>
                      </div>
                    </div>

                    <div className="relative order-1 lg:order-2">
                      <div className="relative group">
                        <div className={`absolute -inset-2 md:-inset-4 bg-[#ca3433] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                        <div className={`relative w-full max-w-[200px] md:max-w-[280px] lg:max-w-none mx-auto aspect-square lg:rounded-full rounded-2xl overflow-hidden border-4 lg:border-8 border-[#ca3433] shadow-2xl`}>
                          {workshop.image ? (
                            <img
                              src={workshop.image}
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
                {workshops.map((_, idx) => (
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
      <footer className="bg-[#0e1f3e] text-white">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src={exceedLogo}
              alt="Exceed Learning Center"
              className="h-10 w-auto"
            />
            <span className="text-lg font-semibold">Exceed Learning Center</span>
          </div>
          <div className="text-sm opacity-80 text-center md:text-right">
            <p>1360 Willis Ave, Albertson, NY</p>
            <p>Adultclasses@exceedlearningcenterny.com</p>
            <p>www.exceedlearningcenterny.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
