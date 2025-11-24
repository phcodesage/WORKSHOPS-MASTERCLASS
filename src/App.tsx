import { Calendar } from 'lucide-react';
import Lenis from 'lenis';
import { useState, useEffect } from 'react';


import img3 from './images/3.png';

import img5 from './images/5.jpg';

import img7 from './images/7.png';
import futureSelfImg from './images/future-self.png';
import goalsWithSoulsImg from './images/goals-wtih-soulds.png';
import yearInReviewImg from './images/year-in-review.png';

const workshops = [
  {
    id: 'goals',
    date: 'Dec 1, 2025 • 6:00 PM',
    title: 'Workshop: Goals with Souls',
    type: 'Workshop',
    image: goalsWithSoulsImg
  },
  {
    id: 'future-self',
    date: 'Dec 23, 2025 • 6:00PM',
    title: 'Workshop: Letter for Your Future Self',
    subtitle: 'Reflect, write, and reconnect with who you are today',
    type: 'Workshop',
    image: futureSelfImg
  },
  {
    id: 'reflect-reset',
    date: 'Dec 23, 2025',
    title: 'Workshop: Reflect, Reset, End the Year and Start a New One',
    subtitle: 'Stronger',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'year-in-review',
    date: 'Dec 30, 2025 • 6:00 PM',
    title: 'Workshop: A Year in Review',
    subtitle: 'Celebrate, Release and Renew',
    type: 'Workshop',
    image: yearInReviewImg
  }
];

const localImages = [goalsWithSoulsImg, futureSelfImg, img3, yearInReviewImg, img5, futureSelfImg, img7, yearInReviewImg];

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
                src="https://lirp.cdn-website.com/3bba8822/dms3rep/multi/opt/Exceed-learning-center-1920w.png"
                alt="Exceed Learning Center"
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold">WORKSHOPS & MASTERCLASS</h1>
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

      {workshops.map((workshop, index) => (
        <section
          key={workshop.id}
          id={workshop.id}
          className="workshop-section h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            backgroundColor: index % 2 === 0 ? '#f7e0e0' : 'white'
          }}
        >
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#ca3433]"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[#0e1f3e]"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[#ca3433]"></div>
          </div>

          <div className="container mx-auto px-6 z-10">
            <div className={`grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
              {index % 2 === 0 ? (
                <>
                  <div className="relative">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-[#ca3433] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-[#ca3433] shadow-2xl">
                        <img
                          src={localImages[index] ?? workshop.image}
                          alt={workshop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -left-8 top-0 w-1 h-full bg-[#ca3433]"></div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#ca3433] text-white px-6 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white flex items-center justify-center">
                          <div className="w-8 h-1 bg-[#ca3433]"></div>
                        </div>
                        <span className="font-bold text-lg">{workshop.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#0e1f3e] leading-tight">
                      {workshop.title}
                    </h2>
                    {workshop.subtitle && (
                      <p className="text-2xl text-[#ca3433] font-semibold">
                        {workshop.subtitle}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-[#ca3433]">
                      <Calendar className="w-8 h-8" />
                      <span className="text-3xl font-bold">{workshop.date}</span>
                    </div>

                    <div className="pt-6">
                      <p className="text-lg text-[#0e1f3e] mb-2">at:</p>
                      <p className="text-xl font-bold text-[#ca3433]">Exceed Learning Center</p>
                      <p className="text-lg text-[#0e1f3e] italic">1360 Willis Ave, Albertson, NY</p>
                    </div>

                    <div className="pt-4">
                      <div className="bg-[#ca3433] text-white px-6 py-3 inline-block mb-4">
                        <p className="text-lg">For adults and young adults</p>
                      </div>
                      <a href="https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01" target="_blank" rel="noopener noreferrer" className="block w-fit bg-[#ca3433] text-white px-8 py-4 text-xl font-semibold rounded-lg hover:bg-[#0e1f3e] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        REGISTER NOW
                      </a>
                    </div>

                    <div className="pt-6 space-y-2">
                      <p className="text-lg text-[#0e1f3e] font-semibold">Secure your spot today!</p>
                      <p className="text-lg text-[#0e1f3e]">Adultclasses@exceedlearningcenterny.com</p>
                      <p className="text-lg text-[#0e1f3e]">www.exceedlearningcenterny.com</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <h2 className="text-4xl lg:text-5xl font-bold text-[#0e1f3e] leading-tight">
                      {workshop.title}
                    </h2>
                    {workshop.subtitle && (
                      <p className="text-2xl text-[#ca3433] font-semibold">
                        {workshop.subtitle}
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-[#ca3433]">
                      <Calendar className="w-8 h-8" />
                      <span className="text-3xl font-bold">{workshop.date}</span>
                    </div>

                    <div className="pt-6">
                      <p className="text-lg text-[#0e1f3e] mb-2">at:</p>
                      <p className="text-xl font-bold text-[#ca3433]">Exceed Learning Center</p>
                      <p className="text-lg text-[#0e1f3e] italic">1360 Willis Ave, Albertson, NY</p>
                    </div>

                    <div className="pt-4">
                      <div className="bg-[#ca3433] text-white px-6 py-3 inline-block mb-4">
                        <p className="text-lg">For adults and young adults</p>
                      </div>
                      <a href="https://buy.stripe.com/5kQ28k9Kk9se9S92SfdfG01" target="_blank" rel="noopener noreferrer" className="block w-fit bg-[#ca3433] text-white px-8 py-4 text-xl font-semibold rounded-lg hover:bg-[#0e1f3e] hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                        REGISTER NOW
                      </a>
                    </div>

                    <div className="pt-6 space-y-2">
                      <p className="text-lg text-[#0e1f3e] font-semibold">Secure your spot today!</p>
                      <p className="text-lg text-[#0e1f3e]">Adultclasses@exceedlearningcenterny.com</p>
                      <p className="text-lg text-[#0e1f3e]">www.exceedlearningcenterny.com</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-[#ca3433] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-[#ca3433] shadow-2xl">
                        <img
                          src={localImages[index] ?? workshop.image}
                          alt={workshop.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -right-8 top-0 w-1 h-full bg-[#ca3433]"></div>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#ca3433] text-white px-6 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white flex items-center justify-center">
                          <div className="w-8 h-1 bg-[#ca3433]"></div>
                        </div>
                        <span className="font-bold text-lg">{workshop.type}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
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
      ))}
      <footer className="bg-[#0e1f3e] text-white">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="https://lirp.cdn-website.com/3bba8822/dms3rep/multi/opt/Exceed-learning-center-1920w.png"
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
