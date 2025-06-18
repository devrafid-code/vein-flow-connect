
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveNav } from '@/components/ui/responsive-nav';

interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodType: string;
  address: string;
  registeredAt: string;
  lastDonationDate?: string;
  neverDonated?: boolean;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    address: '',
    neverDonated: false,
    lastDonationDate: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.bloodType || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Validate donation date if not never donated
    if (!formData.neverDonated && !formData.lastDonationDate) {
      toast({
        title: "Error",
        description: "Please provide your last donation date or check 'Never donated'",
        variant: "destructive",
      });
      return;
    }

    // Create new donor
    const newDonor: Donor = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      bloodType: formData.bloodType,
      address: formData.address,
      registeredAt: new Date().toISOString(),
      neverDonated: formData.neverDonated,
      lastDonationDate: formData.neverDonated ? undefined : formData.lastDonationDate
    };

    // Save to localStorage
    const existingDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    existingDonors.push(newDonor);
    localStorage.setItem('donors', JSON.stringify(existingDonors));

    // Show success dialog
    setShowSuccessDialog(true);
  };

  const handleDialogClose = () => {
    setShowSuccessDialog(false);
    navigate('/donors');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      neverDonated: checked,
      lastDonationDate: checked ? '' : formData.lastDonationDate
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20 md:pb-0">
      <ResponsiveNav />

      {/* Registration Form */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-red-100">
            <CardHeader className="text-center">
              <div className="bg-red-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Register as Blood Donor</CardTitle>
              <p className="text-gray-600">Join our community of heroes and help save lives</p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select your blood type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neverDonated"
                      checked={formData.neverDonated}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="neverDonated" className="text-sm font-medium">
                      I have never donated blood before
                    </Label>
                  </div>

                  {!formData.neverDonated && (
                    <div className="space-y-2">
                      <Label htmlFor="lastDonationDate">Last Donation Date</Label>
                      <Input
                        id="lastDonationDate"
                        name="lastDonationDate"
                        type="date"
                        value={formData.lastDonationDate}
                        onChange={handleInputChange}
                        placeholder="Select your last donation date"
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-lg py-6">
                  <Heart className="h-5 w-5 mr-2" />
                  Register as Donor
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-red-600 mb-4">
              Welcome, Hero! 🎉
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-6">
            {/* Animated Hearts */}
            <div className="relative flex justify-center items-center h-24">
              <Heart className="h-16 w-16 text-red-600 animate-pulse" fill="currentColor" />
              <Heart className="absolute h-8 w-8 text-red-400 animate-bounce" fill="currentColor" style={{ top: '10px', left: '30px' }} />
              <Heart className="absolute h-6 w-6 text-red-300 animate-pulse" fill="currentColor" style={{ bottom: '15px', right: '25px', animationDelay: '0.5s' }} />
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                You're About to Save Lives! 💪
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your registration could help save up to <span className="font-bold text-red-600">3 lives</span> with just one donation. 
                You've joined a community of heroes making a real difference.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">3 Lives</div>
                <div className="text-xs text-gray-500">Per Donation</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">10 Min</div>
                <div className="text-xs text-gray-500">Process Time</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Droplets className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-sm font-medium text-gray-900">56 Days</div>
                <div className="text-xs text-gray-500">Between Donations</div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleDialogClose}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              View All Donors
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
