import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Phone, MapPin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
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
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  return <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-red-100/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-2.5 shadow-lg">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">LifeFlow</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/register')} className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200">
                <Heart className="h-4 w-4 mr-2" />
                Register as Donor
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200">
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Blood Donors</h1>
          <p className="text-xl text-gray-600">Our community of heroes who help save lives</p>
        </div>

        {/* Stats Cards - Moved to top */}
        {donors.length > 0 && <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-red-50/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">{donors.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Donors</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
                  {new Set(donors.map(d => d.bloodType)).size}
                </div>
                <div className="text-sm text-gray-600 font-medium">Blood Types Available</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30">
              <CardContent className="p-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2">
                  {filteredDonors.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Showing Results</div>
              </CardContent>
            </Card>
          </div>}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input placeholder="Search by name or blood type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full border-gray-200 focus:border-red-300 focus:ring-red-100" />
          </div>
          <div className="md:w-48">
            <select value={filterBloodType} onChange={e => setFilterBloodType(e.target.value)} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus:border-red-300 focus:ring-2 focus:ring-red-100 focus-visible:outline-none transition-all duration-200">
              <option value="">All Blood Types</option>
              {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? <Card className="text-center py-16 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
            <CardContent>
              <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                <Heart className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Donors Found</h3>
              <p className="text-gray-600 mb-8 text-lg">
                {donors.length === 0 ? "Be the first to register as a blood donor and help save lives!" : "No donors match your current search criteria."}
              </p>
              <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3">
                <Heart className="h-5 w-5 mr-2" />
                Register as Donor
              </Button>
            </CardContent>
          </Card> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map(donor => <Card key={donor.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 bg-white overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with blood type badge */}
                  <div className="relative bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold">
                        {donor.bloodType}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                        {getInitials(donor.name)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{donor.name}</h3>
                        <p className="text-red-100 text-sm">Blood Donor</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6 space-y-4">
                    {/* Phone number - prominent */}
                    <div className="flex items-center justify-center bg-green-50 rounded-lg p-3 border border-green-200">
                      <Phone className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-lg font-semibold text-green-700">{donor.phone}</span>
                    </div>
                    
                    {/* Address */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">{donor.address}</span>
                    </div>
                    
                    {/* Registration date */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span className="text-blue-700 text-sm font-medium">
                        Registered {formatDate(donor.registeredAt)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>}
      </div>
    </div>;
};
export default Donors;
