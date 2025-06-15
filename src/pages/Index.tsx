import { useState, useEffect } from 'react';
import { Heart, Droplets, Calendar, ArrowRight, Users, Settings, Phone, MapPin, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Index = () => {
  const [donorCount, setDonorCount] = useState(0);
  const [livesCount, setLivesCount] = useState(0);
  const [unitsCount, setUnitsCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    address: ''
  });
  const [lastDonationDate, setLastDonationDate] = useState<Date>();
  const [neverDonated, setNeverDonated] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    bloodType: false,
    address: false,
    lastDonationDate: false
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
    
    // Reset errors
    const newErrors = {
      name: false,
      phone: false,
      bloodType: false,
      address: false,
      lastDonationDate: false
    };

    // Check for empty fields
    if (!formData.name) newErrors.name = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.bloodType) newErrors.bloodType = true;
    if (!formData.address) newErrors.address = true;
    if (!neverDonated && !lastDonationDate) newErrors.lastDonationDate = true;

    setErrors(newErrors);

    // Check if ANY field has errors and show appropriate error message
    const hasAnyError = Object.values(newErrors).some(error => error);
    
    if (hasAnyError) {
      // Prioritize showing the most relevant error message
      if (newErrors.lastDonationDate) {
        toast({
          title: "Error",
          description: "Please select your last donation date or check 'Never donated before'",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
      }
      return;
    }

    const newDonor = {
      id: Date.now().toString(),
      ...formData,
      lastDonationDate: neverDonated ? 'never' : lastDonationDate?.toISOString() || null,
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
    setLastDonationDate(undefined);
    setNeverDonated(false);
    setErrors({
      name: false,
      phone: false,
      bloodType: false,
      address: false,
      lastDonationDate: false
    });
    setTimeout(() => navigate('/donors'), 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false
      });
    }
  };

  const handleNeverDonatedChange = (checked: boolean) => {
    setNeverDonated(checked);
    if (checked) {
      setLastDonationDate(undefined);
      setErrors({
        ...errors,
        lastDonationDate: false
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setLastDonationDate(date);
    if (date) {
      setErrors({
        ...errors,
        lastDonationDate: false
      });
    }
  };

  return <div className="min-h-screen relative">
      {/* Navigation */}
      <nav className="relative z-20 bg-white/90 backdrop-blur-sm border-b border-red-100">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 rounded-full p-2">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">LifeFlow</span>
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => navigate('/donors')}>
                <Users className="h-4 w-4" />
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
        <div className="relative z-10 flex items-center justify-center py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-4 xl:text-7xl">Every Donation Can Save up to 3 Lives.</h1>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto px-4"> Join our community of heroes and make a difference that lasts a lifetime.</p>
              </div>
              
              <div className="flex flex-col gap-4 items-center px-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-fit" onClick={() => navigate('/donors')}>
                  <Users className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  View All Donors
                  <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="relative z-10 py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <form onSubmit={handleQuickRegister} className="space-y-6 sm:space-y-8">
                    {/* First Row - Full name, Blood type, Last Donation Date */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {/* Column 1 - Full Name */}
                      <div className="w-full">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <Users className="h-4 w-4 text-red-600" />
                            Full Name
                          </Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Enter your full name" 
                            className={cn(
                              "h-10 sm:h-12 border-2 transition-colors w-full text-sm sm:text-base",
                              errors.name ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-red-500"
                            )} 
                            required 
                          />
                        </div>
                      </div>

                      {/* Column 2 - Blood Type */}
                      <div className="w-full">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="bloodType" className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <Droplets className="h-4 w-4 text-red-600" />
                            Blood Type
                          </Label>
                          <select 
                            id="bloodType" 
                            name="bloodType" 
                            value={formData.bloodType} 
                            onChange={handleInputChange} 
                            className={cn(
                              "flex h-10 sm:h-12 w-full rounded-md bg-background px-3 sm:px-4 pr-8 sm:pr-10 py-2 sm:py-3 text-sm ring-offset-background focus:outline-none transition-colors border-2",
                              errors.bloodType ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-red-500"
                            )} 
                            required
                          >
                            <option value="">Select blood type</option>
                            {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Column 3 - Last Donation Date (Desktop only) */}
                      <div className="w-full flex-col justify-end hidden lg:flex">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="lastDonationDate" className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <Calendar className="h-4 w-4 text-red-600" />
                            Last Donated On
                          </Label>
                          <div className="space-y-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  disabled={neverDonated}
                                  className={cn(
                                    "h-10 sm:h-12 w-full text-sm sm:text-base justify-start text-left font-normal border-2 transition-colors",
                                    (!lastDonationDate || neverDonated) && "text-muted-foreground",
                                    neverDonated && "cursor-not-allowed opacity-50",
                                    errors.lastDonationDate ? "border-red-500 hover:border-red-500 focus:border-red-500" : "border-gray-200 hover:border-gray-300 focus:border-red-500"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {neverDonated ? "Never donated" : (lastDonationDate ? format(lastDonationDate, "PPP") : <span>Pick a date</span>)}
                                </Button>
                              </PopoverTrigger>
                              {!neverDonated && (
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={lastDonationDate}
                                    onSelect={handleDateSelect}
                                    disabled={(date) => date > new Date()}
                                    initialFocus
                                    className={cn("p-3 pointer-events-auto")}
                                  />
                                </PopoverContent>
                              )}
                            </Popover>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="neverDonated"
                                checked={neverDonated}
                                onChange={(e) => handleNeverDonatedChange(e.target.checked)}
                                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              />
                              <label htmlFor="neverDonated" className="text-sm text-gray-600">
                                Never donated before
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Row - Address, Phone Number, Register Button */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {/* Column 1 - Address */}
                      <div className="w-full">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="address" className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <MapPin className="h-4 w-4 text-red-600" />
                            Address
                          </Label>
                          <Input 
                            id="address" 
                            name="address" 
                            value={formData.address} 
                            onChange={handleInputChange} 
                            placeholder="Your address" 
                            className={cn(
                              "h-10 sm:h-12 border-2 transition-colors w-full text-sm sm:text-base",
                              errors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-red-500"
                            )} 
                            required 
                          />
                        </div>
                      </div>

                      {/* Column 2 - Phone Number */}
                      <div className="w-full">
                        <div className="space-y-2 sm:space-y-3">
                          <Label htmlFor="phone" className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <Phone className="h-4 w-4 text-red-600" />
                            Phone Number
                          </Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                            placeholder="Your phone number" 
                            className={cn(
                              "h-10 sm:h-12 border-2 transition-colors w-full text-sm sm:text-base",
                              errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-red-500"
                            )} 
                            required 
                          />
                        </div>
                      </div>

                      {/* Column 3 - Register Button (Desktop only) */}
                      <div className="w-full flex-col justify-end hidden lg:flex">
                        <Button type="submit" className="bg-red-600 hover:bg-red-700 font-bold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-lg h-10 sm:h-12 w-full">
                          <Heart className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                          Register
                          <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-2" />
                        </Button>
                      </div>
                    </div>

                    {/* Mobile Last Donation Date - Between form rows */}
                    <div className="lg:hidden w-full">
                      <div className="space-y-2 sm:space-y-3">
                        <Label htmlFor="lastDonationDateMobile" className="text-gray-700 font-semibold flex items-center gap-2 text-sm sm:text-base">
                          <Calendar className="h-4 w-4 text-red-600" />
                          Last Donated On
                        </Label>
                        <div className="space-y-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                disabled={neverDonated}
                                className={cn(
                                  "h-10 sm:h-12 w-full text-sm sm:text-base justify-start text-left font-normal border-2 transition-colors",
                                  (!lastDonationDate || neverDonated) && "text-muted-foreground",
                                  neverDonated && "cursor-not-allowed opacity-50",
                                  errors.lastDonationDate ? "border-red-500 hover:border-red-500 focus:border-red-500" : "border-gray-200 hover:border-gray-300 focus:border-red-500"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {neverDonated ? "Never donated" : (lastDonationDate ? format(lastDonationDate, "PPP") : <span>Pick a date</span>)}
                              </Button>
                            </PopoverTrigger>
                            {!neverDonated && (
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={lastDonationDate}
                                  onSelect={handleDateSelect}
                                  disabled={(date) => date > new Date()}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            )}
                          </Popover>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="neverDonatedMobile"
                              checked={neverDonated}
                              onChange={(e) => handleNeverDonatedChange(e.target.checked)}
                              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <label htmlFor="neverDonatedMobile" className="text-sm text-gray-600">
                              Never donated before
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Register Button - Bottom */}
                    <div className="lg:hidden w-full">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700 font-bold py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-lg h-10 sm:h-12 w-full">
                        <Heart className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                        Register
                        <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-2" />
                      </Button>
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
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              © 2024 LifeFlow. Saving lives, one donation at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
