
import { useState, useEffect } from 'react';
import { Heart, Droplets, Calendar, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [donorCount, setDonorCount] = useState(0);
  const [livesCount, setLivesCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);
  const navigate = useNavigate();

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
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => navigate('/donors')}
              >
                <Users className="h-4 w-4 mr-2" />
                View Donors
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => navigate('/register')}
              >
                <Heart className="h-4 w-4 mr-2" />
                Register as Donor
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
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6"
                onClick={() => navigate('/register')}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Register as Donor
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50 text-lg px-8 py-6"
                onClick={() => navigate('/donors')}
              >
                <Users className="h-5 w-5 mr-2" />
                View Donors
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
                  <p className="text-gray-600">Join our community of heroes and save lives today.</p>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => navigate('/register')}
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
