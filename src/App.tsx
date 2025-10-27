import { Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';

const workshops = [
  {
    id: 'masterclass',
    date: 'Nov. 9, 2025',
    title: 'Masterclass: From Surviving to Thriving',
    subtitle: 'Habits, Mindsets, and Practices for a Better Life',
    type: 'Masterclass',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'gratitude',
    date: 'Nov. 12, 2025',
    title: 'Workshop: The Science of Gratitude',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'joyful-moments',
    date: 'Nov 23, 2025',
    title: 'Workshop: The Power of Joyful Moments',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'core-values',
    date: 'Nov. 25, 2025',
    title: 'Workshop: Discover Core Values',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'goals',
    date: 'Dec 2, 2025',
    title: 'Workshop: Goals with Souls',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3184611/pexels-photo-3184611.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'future-self',
    date: 'Dec 17, 2025',
    title: 'Workshop: Letter To Your Future Self',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3771579/pexels-photo-3771579.jpeg?auto=compress&cs=tinysrgb&w=800'
  },
  {
    id: 'reflect-reset',
    date: 'Dec 23, 2025',
    title: 'Workshop: Reflect, Reset, End the Year and Start a New One',
    subtitle: 'Stronger',
    type: 'Workshop',
    image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg?auto=compress&cs=tinysrgb&w=800'
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

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.workshop-section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 bg-[#0e1f3e] text-white z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
                  className={`text-sm hover:text-[#ca3433] transition-colors ${
                    activeSection === index ? 'text-[#ca3433] font-semibold' : ''
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
            <div className={`grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              {index % 2 === 0 ? (
                <>
                  <div className="relative">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-[#ca3433] opacity-20 rounded-full blur-2xl group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-[#ca3433] shadow-2xl">
                        <img
                          src={workshop.image}
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
                      <button className="block w-full lg:w-auto bg-[#ca3433] text-white px-12 py-6 text-3xl font-bold hover:bg-[#0e1f3e] transition-colors duration-300">
                        REGISTER NOW
                      </button>
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
                      <button className="block w-full lg:w-auto bg-[#ca3433] text-white px-12 py-6 text-3xl font-bold hover:bg-[#0e1f3e] transition-colors duration-300">
                        REGISTER NOW
                      </button>
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
                          src={workshop.image}
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
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === index ? 'bg-[#ca3433] w-8' : 'bg-[#0e1f3e] opacity-30'
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
