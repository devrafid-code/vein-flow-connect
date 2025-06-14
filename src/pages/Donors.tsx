import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodType: string;
  address: string;
  registeredAt: string;
}

const Donors = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    const savedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    setDonors(savedDonors);
  }, []);

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = !filterBloodType || donor.bloodType === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-red-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 rounded-full p-2">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LifeFlow</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/register')}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Heart className="h-4 w-4 mr-2" />
                Register as Donor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Donors List */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Donors</h1>
          <p className="text-xl text-gray-600">Our community of heroes who help save lives</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search by name or blood type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterBloodType}
              onChange={(e) => setFilterBloodType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Donors Found</h3>
              <p className="text-gray-600 mb-6">
                {donors.length === 0 
                  ? "Be the first to register as a blood donor and help save lives!"
                  : "No donors match your current search criteria."
                }
              </p>
              <Button 
                onClick={() => navigate('/register')} 
                className="bg-red-600 hover:bg-red-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Register as Donor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="border-2 border-red-100 hover:border-red-300 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg mr-4">
                      {donor.bloodType}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-red-600" />
                      {donor.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-red-600" />
                      {donor.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-red-600" />
                      Registered {formatDate(donor.registeredAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {donors.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-600 mb-2">{donors.length}</div>
                <div className="text-sm text-gray-600">Total Donors</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {new Set(donors.map(d => d.bloodType)).size}
                </div>
                <div className="text-sm text-gray-600">Blood Types Available</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {filteredDonors.length}
                </div>
                <div className="text-sm text-gray-600">Showing Results</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donors;
