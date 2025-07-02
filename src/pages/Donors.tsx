
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Phone, MapPin, Calendar, User, Users, Activity, Grid2X2, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ResponsiveNav } from '@/components/ui/responsive-nav';
import { supabase } from '@/integrations/supabase/client';

interface Donor {
  id: string;
  name: string;
  phone: string;
  blood_type: string;
  address: string;
  registered_at: string;
  last_donation_date?: string;
  never_donated?: boolean;
}

const Donors = () => {
  const navigate = useNavigate();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [loading, setLoading] = useState(true);
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Get blood type colors
  const getBloodTypeColors = (bloodType: string) => {
    const colorMap: Record<string, { from: string; to: string }> = {
      'A+': { from: 'from-emerald-400', to: 'to-emerald-500' },
      'A-': { from: 'from-emerald-500', to: 'to-emerald-600' },
      'B+': { from: 'from-blue-400', to: 'to-blue-500' },
      'B-': { from: 'from-blue-500', to: 'to-blue-600' },
      'AB+': { from: 'from-purple-400', to: 'to-purple-500' },
      'AB-': { from: 'from-purple-500', to: 'to-purple-600' },
      'O+': { from: 'from-orange-400', to: 'to-orange-500' },
      'O-': { from: 'from-orange-500', to: 'to-orange-600' },
    };
    return colorMap[bloodType] || { from: 'from-red-500', to: 'to-red-600' };
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('registered_at', { ascending: false });

      if (error) {
        console.error('Error fetching donors:', error);
        return;
      }

      setDonors(data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || donor.blood_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = filterBloodType === 'all' || donor.blood_type === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLastDonationDisplay = (donor: Donor) => {
    if (donor.never_donated) {
      return 'No donation yet';
    }
    if (donor.last_donation_date) {
      return formatDate(donor.last_donation_date);
    }
    return 'No record';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderGridView = () => <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
      {filteredDonors.map(donor => {
        const colors = getBloodTypeColors(donor.blood_type);
        return <Card key={donor.id} className={`group transition-all duration-500 border-0 shadow-lg cursor-pointer overflow-hidden relative z-10 ${hoveredCard && hoveredCard !== donor.id ? 'scale-95 opacity-75' : hoveredCard === donor.id ? 'shadow-2xl scale-105 z-50' : 'hover:shadow-2xl hover:-translate-y-2'} bg-gradient-to-br from-white via-white to-gray-50/30`} onMouseEnter={() => setHoveredCard(donor.id)} onMouseLeave={() => setHoveredCard(null)}>
          <CardContent className="p-0">
            {/* Header section with gradient */}
            <div className="bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent p-6 pb-4">
              <div className="flex items-center space-x-4">
                <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white group-hover:scale-105 transition-transform duration-300`}>
                  {donor.blood_type}
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
                    <Droplets className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium">Last donation: {getLastDonationDisplay(donor)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      })}
    </div>;

  const renderTableView = () => <Card className="border-0 shadow-lg bg-white">
      <CardContent className="p-0">
        <TableComponent>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-red-50 to-red-25">
              <TableHead className="font-bold text-gray-900">Name</TableHead>
              <TableHead className="font-bold text-gray-900">Blood Type</TableHead>
              <TableHead className="font-bold text-gray-900">Phone</TableHead>
              <TableHead className="font-bold text-gray-900">Address</TableHead>
              <TableHead className="font-bold text-gray-900">Last Donation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.map(donor => <TableRow key={donor.id} className="hover:bg-red-50/50 transition-colors duration-200">
                <TableCell className="font-medium text-gray-900">{donor.name}</TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold">
                    {donor.blood_type}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-green-700">{donor.phone}</TableCell>
                <TableCell className="text-gray-600 max-w-xs truncate">{donor.address}</TableCell>
                <TableCell className="text-gray-600">{getLastDonationDisplay(donor)}</TableCell>
              </TableRow>)}
          </TableBody>
        </TableComponent>
      </CardContent>
    </Card>;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 pb-20 md:pb-0">
        <ResponsiveNav />
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading donors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50/30 pb-20 md:pb-0">
      <ResponsiveNav />

      {/* Donors List */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">Blood Donors</h1>
          <p className="text-xl text-gray-600">Our community of heroes who help save lives</p>
        </div>

        {/* Filters */}
        <div className="rounded-2xl p-6 mb-8 px-0">
          <div className="flex flex-col lg:flex-row gap-6 pb-6 border-b border-gray-200">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or blood type..." 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                className="w-full border-gray-200 focus:border-red-300 focus:ring-red-100 rounded-xl h-10 pl-10" 
              />
            </div>
            
            {/* Vertical separator after search bar */}
            <div className="hidden lg:block w-px bg-gray-300 mx-2"></div>
            
            {/* Blood Type Chips and View Toggle with vertical separators */}
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              {/* Blood Type Chips */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setFilterBloodType('all')} className={`px-6 py-1 rounded-xl text-sm font-medium transition-all duration-200 h-10 ${filterBloodType === 'all' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  All
                </button>
                {bloodTypes.map(type => <button key={type} onClick={() => setFilterBloodType(type)} className={`px-6 py-1 rounded-xl text-sm font-medium transition-all duration-200 h-10 ${filterBloodType === type ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {type}
                  </button>)}
              </div>
              
              {/* Vertical separator */}
              <div className="hidden sm:block w-px bg-gray-300 mx-2"></div>
              
              {/* View Toggle */}
              <div className="bg-red-50 rounded-xl p-1 h-10 flex items-center">
                <ToggleGroup type="single" value={viewMode} onValueChange={value => value && setViewMode(value as 'grid' | 'table')}>
                  <ToggleGroupItem value="grid" aria-label="Grid view" className="data-[state=on]:bg-red-500 data-[state=on]:text-white rounded-xl h-8">
                    <Grid2X2 className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" aria-label="Table view" className="data-[state=on]:bg-red-500 data-[state=on]:text-white rounded-xl h-8">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>

        {/* Donors List */}
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
          </Card> : viewMode === 'grid' ? renderGridView() : renderTableView()}
      </div>
    </div>
  );
};

export default Donors;
