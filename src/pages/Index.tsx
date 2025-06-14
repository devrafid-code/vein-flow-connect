
import { useState, useEffect } from 'react';
import { Heart, Droplets, Users, Calendar, ArrowRight, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [donorCount, setDonorCount] = useState(0);
  const [livesCount, setLivesCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    const animateCounter = (target: number, setter: (value: number) => void, duration: number = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    const timer = setTimeout(() => {
      animateCounter(15000, setDonorCount);
      animateCounter(45000, setLivesCount);
      animateCounter(125000, setUnitsCount);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Animated Blood Vein Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Animated blood vein lines */}
          <path
            d="M0,400 Q300,200 600,400 T1200,400"
            stroke="url(#bloodGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,300 Q400,100 800,300 T1200,300"
            stroke="url(#bloodGradient)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
          <path
            d="M0,500 Q200,700 400,500 T800,500 T1200,500"
            stroke="url(#bloodGradient)"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-red-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 rounded-full p-2">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LifeFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-red-600 transition-colors">About</a>
              <a href="#process" className="text-gray-700 hover:text-red-600 transition-colors">Process</a>
              <a href="#locations" className="text-gray-700 hover:text-red-600 transition-colors">Locations</a>
              <Button className="bg-red-600 hover:bg-red-700">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Give Life,
                <span className="text-red-600 block">Save Lives</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Every donation can save up to three lives. Join our community of heroes 
                and make a difference that lasts a lifetime.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Donation
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 text-lg px-8 py-6">
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{donorCount.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">Active Donors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{livesCount.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">Lives Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{unitsCount.toLocaleString()}+</div>
                <div className="text-sm text-gray-600">Units Collected</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-2xl p-8 shadow-xl transform -rotate-3">
                <div className="text-center space-y-6">
                  <div className="bg-red-600 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                    <Heart className="h-12 w-12 text-white animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Ready to Donate?</h3>
                  <p className="text-gray-600">The process is quick, safe, and saves lives. Book your appointment today.</p>
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Find Nearest Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Donate Section */}
      <section id="about" className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Your Donation Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Blood donation is one of the most impactful ways to help your community. 
              Here's how your single donation creates a ripple effect of hope.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors group">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Emergency Response</h3>
                <p className="text-gray-600">
                  Your blood helps accident victims, surgery patients, and those with medical conditions 
                  requiring immediate transfusions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors group">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cancer Treatment</h3>
                <p className="text-gray-600">
                  Cancer patients often need blood transfusions during chemotherapy and other treatments 
                  to maintain their strength.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 hover:border-red-300 transition-colors group">
              <CardContent className="p-8 text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Droplets className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Chronic Conditions</h3>
                <p className="text-gray-600">
                  People with sickle cell disease, thalassemia, and other blood disorders 
                  depend on regular donations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Donation Process */}
      <section id="process" className="relative z-10 bg-gradient-to-br from-gray-50 to-red-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Donation Process</h2>
            <p className="text-xl text-gray-600">
              Donating blood is easier than you think. Here's what to expect during your visit.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Registration", desc: "Fill out a brief health questionnaire and show ID" },
              { step: 2, title: "Health Check", desc: "Quick vitals check including blood pressure and hemoglobin" },
              { step: 3, title: "Donation", desc: "The actual donation takes 8-10 minutes in a comfortable setting" },
              { step: 4, title: "Recovery", desc: "Enjoy snacks and drinks while you rest for 10-15 minutes" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Locations */}
      <section id="locations" className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Find a Donation Center</h2>
              <p className="text-xl text-gray-600 mb-8">
                We have convenient locations throughout the city, with flexible hours 
                to fit your schedule.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Downtown Medical Center</h3>
                    <p className="text-gray-600">123 Health Ave, City Center</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Open 7 Days a Week</h3>
                    <p className="text-gray-600">Mon-Fri: 8AM-8PM, Weekends: 9AM-5PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Call to Schedule</h3>
                    <p className="text-gray-600">(555) 123-LIFE</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Save Lives?</h3>
              <p className="mb-8 opacity-90">
                Schedule your donation today and join thousands of heroes in our community 
                who are making a difference.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-white text-red-600 hover:bg-gray-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment Online
                </Button>
                <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-red-600">
                  <Mail className="h-4 w-4 mr-2" />
                  Get Email Reminders
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-red-500">
                <p className="text-sm opacity-80">
                  Walk-ins welcome, but appointments ensure shorter wait times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-600 rounded-full p-2">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">LifeFlow</span>
              </div>
              <p className="text-gray-400">
                Connecting donors with those in need, one donation at a time.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Donate Blood</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Locations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Eligibility</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile Units</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Emergency Line</h4>
              <p className="text-red-400 text-xl font-bold">(555) 123-LIFE</p>
              <p className="text-gray-400 text-sm mt-2">
                24/7 support for urgent blood needs
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LifeFlow. All rights reserved. Saving lives together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
