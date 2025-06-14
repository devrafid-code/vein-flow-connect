import { useState, useEffect } from 'react';
import { Heart, Droplets, Calendar, ArrowRight, Users, Settings, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [donorCount, setDonorCount] = useState(0);
  const [livesCount, setLivesCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    address: ''
  });
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.bloodType || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    const newDonor = {
      id: Date.now().toString(),
      ...formData,
      registeredAt: new Date().toISOString()
    };
    const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    existingDonors.push(newDonor);
    localStorage.setItem('donors', JSON.stringify(existingDonors));
    toast({
      title: "Success!",
      description: "You've been registered as a blood donor!"
    });
    setFormData({
      name: '',
      phone: '',
      bloodType: '',
      address: ''
    });
    setTimeout(() => navigate('/donors'), 1500);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="relative z-20 bg-white/90 backdrop-blur-sm border-b border-red-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 rounded-full p-2">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LifeFlow</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Button variant="outline" className="border-gray-600 text-gray-600 hover:bg-gray-50" onClick={() => navigate('/dashboard')}>
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => navigate('/donors')}>
                <Users className="h-4 w-4 mr-2" />
                View Donors
              </Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={() => navigate('/register')}>
                <Heart className="h-4 w-4 mr-2" />
                Register as Donor
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Hero Section */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center" style={{
      backgroundImage: `url('/lovable-uploads/c4530eba-7ea7-4705-96b9-c43b27d2c9d5.png')`
    }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Column - Hero Text (50% width) */}
            <div className="space-y-8 flex flex-col justify-center h-full">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">Every Donation Can Save up to 3 Lives.</h1>
                <p className="text-lg text-white/90 leading-relaxed">
                  Every donation can save up to three lives. Join our community of heroes 
                  and make a difference that lasts a lifetime.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6 w-fit" onClick={() => navigate('/donors')}>
                  <Users className="h-5 w-5 mr-2" />
                  View All Donors
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Column - Registration Form (50% width) */}
            <div className="w-full">
              <Card className="border-2 border-red-100 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="bg-red-600 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Quick Registration</CardTitle>
                  <p className="text-sm text-gray-600">Become a hero today</p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleQuickRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" className="h-10" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Your phone number" className="h-10" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodType" className="text-sm font-medium">Blood Type</Label>
                      <select id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleInputChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required>
                        <option value="">Select blood type</option>
                        {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Your address" className="h-10" required />
                    </div>

                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3">
                      <Heart className="h-4 w-4 mr-2" />
                      Register Now
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      By registering, you agree to be contacted for donation opportunities
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-white/90 backdrop-blur-sm border-t border-red-100">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 LifeFlow. Saving lives, one donation at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};

export default Index;
