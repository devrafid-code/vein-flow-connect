
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Heart, Phone, MapPin, Calendar, Filter } from 'lucide-react';
import { ResponsiveNav } from '@/components/ui/responsive-nav';

interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodType: string;
  address: string;
  registeredAt: string;
}

const Donors = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('all');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Load donors from localStorage
  useEffect(() => {
    const savedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    setDonors(savedDonors);
  }, []);

  // Filter donors
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         donor.phone.includes(searchTerm) ||
                         donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = filterBloodType === 'all' || donor.bloodType === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  // Get blood type stats
  const bloodTypeStats = bloodTypes.map(type => ({
    type,
    count: donors.filter(donor => donor.bloodType === type).length
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get blood type color - using consistent color scheme
  const getBloodTypeColor = (bloodType: string) => {
    const colors: { [key: string]: string } = {
      'A+': 'bg-red-100 text-red-800 border-red-200',
      'A-': 'bg-red-200 text-red-900 border-red-300',
      'B+': 'bg-blue-100 text-blue-800 border-blue-200',
      'B-': 'bg-blue-200 text-blue-900 border-blue-300',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-200 text-purple-900 border-purple-300',
      'O+': 'bg-green-100 text-green-800 border-green-200',
      'O-': 'bg-green-200 text-green-900 border-green-300'
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20 md:pb-0">
      <ResponsiveNav />
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Blood Donor Directory
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Find registered blood donors in your area. Contact them directly for urgent needs.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-8">
          {bloodTypeStats.map(stat => (
            <Card key={stat.type} className="text-center border border-gray-200">
              <CardContent className="p-3 sm:p-4">
                <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold mb-2 border ${getBloodTypeColor(stat.type)}`}>
                  {stat.type}
                </div>
                <div className="text-lg sm:text-xl font-bold text-gray-900">{stat.count}</div>
                <div className="text-xs sm:text-sm text-gray-600">donors</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, phone, blood type, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 sm:h-12 text-base"
                />
              </div>

              {/* Blood Type Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterBloodType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterBloodType('all')}
                  className={`text-xs sm:text-sm ${filterBloodType === 'all' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 hover:text-red-600'}`}
                >
                  All Types
                </Button>
                {bloodTypes.map(type => (
                  <Button
                    key={type}
                    variant={filterBloodType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBloodType(type)}
                    className={`text-xs sm:text-sm ${filterBloodType === type ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 hover:text-red-600'}`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donors List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
              <span>Available Donors ({filteredDonors.length})</span>
              <Users className="h-5 w-5 text-gray-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {filteredDonors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  {donors.length === 0 
                    ? "No donors have registered yet." 
                    : "No donors match your search criteria. Try adjusting your filters."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonors.map(donor => (
                  <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Name & Blood Type */}
                      <div className="flex items-center space-x-3">
                        <div className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm font-bold border ${getBloodTypeColor(donor.bloodType)}`}>
                          {donor.bloodType}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{donor.name}</h3>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-900 font-medium">{donor.phone}</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-900 font-medium truncate">{donor.address}</span>
                      </div>

                      {/* Registration Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-600">
                          Registered {formatDate(donor.registeredAt)}
                        </span>
                      </div>
                    </div>

                    {/* Contact Button for Mobile */}
                    <div className="mt-4 sm:hidden">
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => window.open(`tel:${donor.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call {donor.name}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <Card className="mt-8 bg-red-50 border-red-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <Heart className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2">Emergency Blood Need?</h3>
              <p className="text-sm sm:text-base text-red-700 mb-4">
                Contact donors directly using their phone numbers. Always respect their availability and be polite when requesting donations.
              </p>
              <p className="text-xs sm:text-sm text-red-600 font-medium">
                Remember: Blood donation saves lives. Thank a donor today!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donors;
