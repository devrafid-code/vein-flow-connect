import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Phone, MapPin, Calendar, User, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Sample donors data
  const sampleDonors: Donor[] = [
    {
      id: '1',
      name: 'John Smith',
      phone: '+1-555-0123',
      bloodType: 'O+',
      address: '123 Main St, New York, NY',
      registeredAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      phone: '+1-555-0234',
      bloodType: 'A+',
      address: '456 Oak Ave, Los Angeles, CA',
      registeredAt: '2024-02-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Michael Brown',
      phone: '+1-555-0345',
      bloodType: 'B-',
      address: '789 Pine Rd, Chicago, IL',
      registeredAt: '2024-03-10T09:45:00Z'
    },
    {
      id: '4',
      name: 'Emily Davis',
      phone: '+1-555-0456',
      bloodType: 'AB+',
      address: '321 Elm St, Houston, TX',
      registeredAt: '2024-03-25T16:20:00Z'
    },
    {
      id: '5',
      name: 'David Wilson',
      phone: '+1-555-0567',
      bloodType: 'O-',
      address: '654 Maple Dr, Phoenix, AZ',
      registeredAt: '2024-04-05T11:30:00Z'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      phone: '+1-555-0678',
      bloodType: 'A-',
      address: '987 Cedar Ln, Philadelphia, PA',
      registeredAt: '2024-04-18T13:45:00Z'
    },
    {
      id: '7',
      name: 'Robert Taylor',
      phone: '+1-555-0789',
      bloodType: 'B+',
      address: '147 Birch St, San Antonio, TX',
      registeredAt: '2024-05-02T08:15:00Z'
    },
    {
      id: '8',
      name: 'Jennifer White',
      phone: '+1-555-0890',
      bloodType: 'AB-',
      address: '258 Spruce Ave, San Diego, CA',
      registeredAt: '2024-05-15T15:30:00Z'
    },
    {
      id: '9',
      name: 'Christopher Lee',
      phone: '+1-555-0901',
      bloodType: 'O+',
      address: '369 Willow Rd, Dallas, TX',
      registeredAt: '2024-05-28T12:00:00Z'
    },
    {
      id: '10',
      name: 'Amanda Garcia',
      phone: '+1-555-1012',
      bloodType: 'A+',
      address: '741 Ash Dr, San Jose, CA',
      registeredAt: '2024-06-03T10:45:00Z'
    },
    {
      id: '11',
      name: 'Matthew Martinez',
      phone: '+1-555-1123',
      bloodType: 'B-',
      address: '852 Poplar St, Austin, TX',
      registeredAt: '2024-06-08T14:30:00Z'
    },
    {
      id: '12',
      name: 'Jessica Rodriguez',
      phone: '+1-555-1234',
      bloodType: 'AB+',
      address: '963 Hickory Ave, Jacksonville, FL',
      registeredAt: '2024-06-12T09:20:00Z'
    },
    {
      id: '13',
      name: 'Daniel Hernandez',
      phone: '+1-555-1345',
      bloodType: 'O-',
      address: '159 Walnut Ln, Fort Worth, TX',
      registeredAt: '2024-06-15T16:45:00Z'
    },
    {
      id: '14',
      name: 'Ashley Lopez',
      phone: '+1-555-1456',
      bloodType: 'A-',
      address: '753 Chestnut Rd, Columbus, OH',
      registeredAt: '2024-06-18T11:15:00Z'
    },
    {
      id: '15',
      name: 'Kevin Gonzalez',
      phone: '+1-555-1567',
      bloodType: 'B+',
      address: '486 Sycamore Dr, Charlotte, NC',
      registeredAt: '2024-06-20T13:30:00Z'
    },
    {
      id: '16',
      name: 'Stephanie Wilson',
      phone: '+1-555-1678',
      bloodType: 'AB-',
      address: '297 Magnolia St, Seattle, WA',
      registeredAt: '2024-06-22T08:45:00Z'
    },
    {
      id: '17',
      name: 'Brian Anderson',
      phone: '+1-555-1789',
      bloodType: 'O+',
      address: '518 Dogwood Ave, Denver, CO',
      registeredAt: '2024-06-24T15:20:00Z'
    },
    {
      id: '18',
      name: 'Michelle Thomas',
      phone: '+1-555-1890',
      bloodType: 'A+',
      address: '629 Redwood Ln, Boston, MA',
      registeredAt: '2024-06-26T12:10:00Z'
    },
    {
      id: '19',
      name: 'Steven Jackson',
      phone: '+1-555-1901',
      bloodType: 'B-',
      address: '740 Palm Dr, El Paso, TX',
      registeredAt: '2024-06-28T10:30:00Z'
    },
    {
      id: '20',
      name: 'Nicole White',
      phone: '+1-555-2012',
      bloodType: 'AB+',
      address: '851 Cypress Rd, Detroit, MI',
      registeredAt: '2024-06-30T14:45:00Z'
    }
  ];

  useEffect(() => {
    const savedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    // Combine saved donors with sample donors, avoiding duplicates
    const allDonors = [...savedDonors];
    
    sampleDonors.forEach(sampleDonor => {
      if (!allDonors.find(donor => donor.id === sampleDonor.id)) {
        allDonors.push(sampleDonor);
      }
    });
    
    setDonors(allDonors);
    // Save the combined list back to localStorage
    localStorage.setItem('donors', JSON.stringify(allDonors));
  }, []);

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = filterBloodType === 'all' || donor.bloodType === filterBloodType;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30">
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

        {/* Stats Cards - Subtle Redesign */}
        {donors.length > 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Donors Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{donors.length}</div>
                    <div className="text-gray-600 font-medium">Total Donors</div>
                  </div>
                  <div className="bg-red-50 rounded-full p-3">
                    <Users className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blood Types Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {new Set(donors.map(d => d.bloodType)).size}
                    </div>
                    <div className="text-gray-600 font-medium">Blood Types</div>
                  </div>
                  <div className="bg-blue-50 rounded-full p-3">
                    <Droplets className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Locations Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {new Set(donors.map(d => d.address)).size}
                    </div>
                    <div className="text-gray-600 font-medium">Locations</div>
                  </div>
                  <div className="bg-purple-50 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Results Card */}
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{filteredDonors.length}</div>
                    <div className="text-gray-600 font-medium">Active Results</div>
                  </div>
                  <div className="bg-green-50 rounded-full p-3">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input 
              placeholder="Search by name or blood type..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full border-gray-200 focus:border-red-300 focus:ring-red-100" 
            />
          </div>
          <div className="md:w-48">
            <Select value={filterBloodType} onValueChange={setFilterBloodType}>
              <SelectTrigger className="border-gray-200 focus:border-red-300 focus:ring-red-100">
                <SelectValue placeholder="All Blood Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Types</SelectItem>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Donors Grid */}
        {filteredDonors.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/50">
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
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {filteredDonors.map(donor => (
              <Card 
                key={donor.id} 
                className={`group transition-all duration-500 border-0 shadow-lg cursor-pointer overflow-hidden relative z-10 ${
                  hoveredCard && hoveredCard !== donor.id 
                    ? 'scale-95 opacity-75' 
                    : hoveredCard === donor.id 
                      ? 'shadow-2xl scale-105 z-50' 
                      : 'hover:shadow-2xl hover:-translate-y-2'
                } bg-gradient-to-br from-white via-white to-gray-50/30`}
                onMouseEnter={() => setHoveredCard(donor.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-0">
                  {/* Header section with gradient */}
                  <div className="bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent p-6 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white group-hover:scale-105 transition-transform duration-300">
                        {donor.bloodType}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate mb-2 group-hover:text-red-700 transition-colors duration-200">{donor.name}</h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-6 pt-2">
                    {/* Mobile number prominently displayed */}
                    <div className="flex items-center mb-4">
                      <Phone className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-lg font-bold text-gray-900">{donor.phone}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600 group/item hover:text-gray-800 transition-colors duration-200">
                        <div className="bg-gray-100 group-hover/item:bg-gray-200 rounded-lg p-2 mr-3 transition-colors duration-200">
                          <MapPin className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="truncate text-sm font-medium">{donor.address}</span>
                      </div>
                      <div className="flex items-center text-gray-600 group/item hover:text-gray-800 transition-colors duration-200">
                        <div className="bg-gray-100 group-hover/item:bg-gray-200 rounded-lg p-2 mr-3 transition-colors duration-200">
                          <Calendar className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium">Registered {formatDate(donor.registeredAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Donors;
