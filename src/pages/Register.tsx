
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, User, Phone, MapPin, Droplets, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveNav } from '@/components/ui/responsive-nav';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    address: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.bloodType || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID for the donor
    const donorId = Date.now().toString();
    
    const newDonor = {
      id: donorId,
      ...formData,
      registeredAt: new Date().toISOString()
    };

    // Get existing donors from localStorage
    const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    
    // Add new donor
    const updatedDonors = [...existingDonors, newDonor];
    localStorage.setItem('donors', JSON.stringify(updatedDonors));

    toast({
      title: "Success!",
      description: "You have been registered as a blood donor successfully.",
    });

    // Reset form
    setFormData({ name: '', phone: '', bloodType: '', address: '' });
    
    // Navigate to donors page after a short delay
    setTimeout(() => {
      navigate('/donors');
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20 md:pb-0">
      <ResponsiveNav />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3">
              <Heart className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Become a Life Saver
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Join our community of heroes. Your donation can save up to three lives.
          </p>
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-red-100 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-gray-900">
                Donor Registration
              </CardTitle>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                Please provide your information to register as a blood donor
              </p>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base font-medium flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-600" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-11 sm:h-12 text-base"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-600" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-11 sm:h-12 text-base"
                    required
                  />
                </div>

                {/* Blood Type */}
                <div className="space-y-2">
                  <Label htmlFor="bloodType" className="text-sm sm:text-base font-medium flex items-center">
                    <Droplets className="h-4 w-4 mr-2 text-gray-600" />
                    Blood Type
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('bloodType', value)}>
                    <SelectTrigger className="h-11 sm:h-12 text-base">
                      <SelectValue placeholder="Select your blood type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border shadow-lg">
                      {bloodTypes.map((type) => (
                        <SelectItem key={type} value={type} className="cursor-pointer hover:bg-red-50">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm sm:text-base font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-600" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="h-11 sm:h-12 text-base"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 sm:h-14 text-base sm:text-lg font-semibold mt-8"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Register as Donor
                </Button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 text-center">
                  <strong>Important:</strong> By registering, you agree to be contacted when your blood type is needed for life-saving donations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
