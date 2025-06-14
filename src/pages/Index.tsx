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

      {/* Hero Section with Background */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col" style={{
      backgroundImage: `url('/lovable-uploads/c4530eba-7ea7-4705-96b9-c43b27d2c9d5.png')`
    }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero Text Section */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">Every Donation Can Save up to 3 Lives.</h1>
                <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                  Every donation can save up to three lives. Join our community of heroes 
                  and make a difference that lasts a lifetime.
                </p>
              </div>
              
              <div className="flex flex-col gap-4 items-center">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6 w-fit" onClick={() => navigate('/donors')}>
                  <Users className="h-5 w-5 mr-2" />
                  View All Donors
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="relative z-10 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                <div className="bg-red-600 px-8 py-4">
                  <div className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Register as Blood Donor</CardTitle>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <form onSubmit={handleQuickRegister} className="space-y-8">
                    {/* Updated Layout with Equal Width Columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column - Input Fields */}
                      <div className="w-full">
                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-2">
                              <Users className="h-4 w-4 text-red-600" />
                              Full Name
                            </Label>
                            <Input 
                              id="name" 
                              name="name" 
                              value={formData.name} 
                              onChange={handleInputChange} 
                              placeholder="Enter your full name" 
                              className="h-12 border-2 border-gray-200 focus:border-red-500 transition-colors w-full" 
                              required 
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center gap-2">
                              <Phone className="h-4 w-4 text-red-600" />
                              Phone Number
                            </Label>
                            <Input 
                              id="phone" 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange} 
                              placeholder="Your phone number" 
                              className="h-12 border-2 border-gray-200 focus:border-red-500 transition-colors w-full" 
                              required 
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="bloodType" className="text-gray-700 font-semibold flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-red-600" />
                              Blood Type
                            </Label>
                            <select 
                              id="bloodType" 
                              name="bloodType" 
                              value={formData.bloodType} 
                              onChange={handleInputChange} 
                              className="flex h-12 w-full rounded-md border-2 border-gray-200 bg-background px-4 py-3 text-sm ring-offset-background focus:border-red-500 focus:outline-none transition-colors" 
                              required
                            >
                              <option value="">Select blood type</option>
                              {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="address" className="text-gray-700 font-semibold flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-red-600" />
                              Address
                            </Label>
                            <Input 
                              id="address" 
                              name="address" 
                              value={formData.address} 
                              onChange={handleInputChange} 
                              placeholder="Your address" 
                              className="h-12 border-2 border-gray-200 focus:border-red-500 transition-colors w-full" 
                              required 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Button */}
                      <div className="w-full flex flex-col justify-center">
                        <div className="w-full">
                          <Button 
                            type="submit" 
                            className="bg-red-600 hover:bg-red-700 font-bold py-4 px-12 text-lg w-full h-12"
                          >
                            <Heart className="h-5 w-5 mr-3" />
                            Register as Blood Donor
                            <ArrowRight className="h-5 w-5 ml-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
