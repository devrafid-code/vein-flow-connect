
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Droplets, Users, Shield, Phone, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveNav } from '@/components/ui/responsive-nav';

const Index = () => {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Active Donors', value: '2,500+', color: 'text-red-600' },
    { icon: Droplets, label: 'Lives Saved', value: '10,000+', color: 'text-blue-600' },
    { icon: Heart, label: 'Success Rate', value: '98%', color: 'text-green-600' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Clock,
      title: 'Quick Registration',
      description: 'Register as a donor in less than 5 minutes'
    },
    {
      icon: MapPin,
      title: 'Location Tracking',
      description: 'Find nearby donors and donation centers'
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for urgent needs'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20 md:pb-0">
      <ResponsiveNav />
      
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Save Lives with
            <span className="text-red-600 block sm:inline sm:ml-3">LifeFlow</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto px-4">
            Connect blood donors with those in need. A simple, secure platform that helps save lives every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
              onClick={() => navigate('/register')}
            >
              <Heart className="mr-2 h-5 w-5" />
              Become a Donor
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-red-600 text-red-600 hover:bg-red-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
              onClick={() => navigate('/donors')}
            >
              <Users className="mr-2 h-5 w-5" />
              Find Donors
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-24">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2 border-red-100 hover:border-red-200 transition-colors">
              <CardContent className="p-6 md:p-8">
                <stat.icon className={`h-10 w-10 md:h-12 md:w-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-6">
            Why Choose LifeFlow?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center mb-12 md:mb-16 max-w-2xl mx-auto px-4">
            Our platform is designed with both donors and recipients in mind, ensuring a seamless experience for everyone.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-4 md:p-6 border-2 border-gray-100 hover:border-red-200 transition-colors">
                <CardContent className="p-4 md:p-6">
                  <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-red-600 text-white border-0 p-6 md:p-12">
          <CardContent className="text-center p-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6">Ready to Make a Difference?</h2>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 md:mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of heroes who are already saving lives through blood donation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                onClick={() => navigate('/register')}
              >
                Register Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold w-full sm:w-auto"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
