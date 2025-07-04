
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Plus, Edit, Trash2, Search, Filter, Users, Activity, Phone, MapPin, Calendar, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import { supabase } from '@/integrations/supabase/client';

interface Donor {
  id: string;
  name: string;
  phone: string;
  blood_type: string;
  address: string;
  registered_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isAuthenticated, isLoading, logout } = useAuth();
  
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    blood_type: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Show loading screen while auth is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-600 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <Droplets className="h-8 w-8 text-white animate-pulse" />
          </div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div 
              className="flex items-center justify-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity mb-6"
              onClick={() => navigate('/')}
            >
              <div className="bg-red-600 rounded-full p-3">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-900">LifeFlow</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Access</h1>
            <p className="text-gray-600">Please login to access the donor dashboard</p>
          </div>
          
          <LoginForm />
          
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get blood type color - using grayish background with black text
  const getBloodTypeColor = (bloodType: string) => {
    return 'bg-gray-200 text-black border-gray-300';
  };

  // Load donors from Supabase
  useEffect(() => {
    const fetchDonors = async () => {
      console.log('Fetching donors...');
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('donors')
          .select('*')
          .order('registered_at', { ascending: false });

        if (error) {
          console.error('Error fetching donors:', error);
          toast({
            title: "Error",
            description: "Failed to load donors",
            variant: "destructive",
          });
        } else {
          console.log('Donors fetched successfully:', data?.length || 0);
          setDonors(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Something went wrong while loading donors",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchDonors();
    }
  }, [isAuthenticated, toast]);

  // Filter donors
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         donor.phone.includes(searchTerm) ||
                         donor.blood_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = filterBloodType === 'all' || donor.blood_type === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  // Handle edit donor
  const handleEditDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setEditFormData({
      name: donor.name,
      phone: donor.phone,
      blood_type: donor.blood_type,
      address: donor.address
    });
    setShowEditDialog(true);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!selectedDonor) return;

    // Validate form
    if (!editFormData.name || !editFormData.phone || !editFormData.blood_type || !editFormData.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('donors')
        .update({
          name: editFormData.name,
          phone: editFormData.phone,
          blood_type: editFormData.blood_type,
          address: editFormData.address,
        })
        .eq('id', selectedDonor.id);

      if (error) {
        console.error('Error updating donor:', error);
        toast({
          title: "Error",
          description: "Failed to update donor information",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      const updatedDonors = donors.map(donor => 
        donor.id === selectedDonor.id 
          ? { ...donor, ...editFormData }
          : donor
      );
      setDonors(updatedDonors);
      setShowEditDialog(false);
      setSelectedDonor(null);
      
      toast({
        title: "Success",
        description: "Donor information updated successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong while updating donor",
        variant: "destructive",
      });
    }
  };

  // Handle delete donor
  const handleDeleteDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedDonor) return;

    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', selectedDonor.id);

      if (error) {
        console.error('Error deleting donor:', error);
        toast({
          title: "Error",
          description: "Failed to delete donor",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      const updatedDonors = donors.filter(donor => donor.id !== selectedDonor.id);
      setDonors(updatedDonors);
      setShowDeleteDialog(false);
      setSelectedDonor(null);
      
      toast({
        title: "Success",
        description: "Donor deleted successfully",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong while deleting donor",
        variant: "destructive",
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-16 md:pb-0">
      {/* Navigation */}
      <nav className="relative z-20 bg-white/90 backdrop-blur-sm border-b border-red-100">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/')}
            >
              <div className="bg-red-600 rounded-full p-2">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">LifeFlow</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/donors')}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Users className="h-4 w-4 mr-2" />
                View Donors
              </Button>
              
              <Button
                onClick={() => navigate('/register')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Heart className="h-4 w-4 mr-2" />
                Register as Donor
              </Button>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Donor Management</h1>
              <p className="text-lg sm:text-xl text-gray-600">
                Welcome back, {currentUser?.name || currentUser?.email}! Manage and monitor your blood donor database
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, phone, or blood type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterBloodType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterBloodType('all')}
                  className={filterBloodType === 'all' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  All Types
                </Button>
                {bloodTypes.map(type => (
                  <Button
                    key={type}
                    variant={filterBloodType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBloodType(type)}
                    className={filterBloodType === type ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Donors Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Donors ({filteredDonors.length})</CardTitle>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Donor
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="bg-red-600 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                  <Droplets className="h-8 w-8 text-white animate-pulse" />
                </div>
                <p className="text-lg text-gray-600">Loading donors...</p>
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  {donors.length === 0 
                    ? "No donors registered yet. Add the first donor to get started."
                    : "No donors match your search criteria."
                  }
                </p>
                <Button onClick={() => navigate('/register')} className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Donor
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDonors.map(donor => (
                  <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start lg:items-center">
                      {/* Name & Blood Type Column */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`${getBloodTypeColor(donor.blood_type)} rounded-full p-2 flex items-center justify-center w-10 h-10 border`}>
                            <span className="font-bold text-sm">{donor.blood_type}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                          </div>
                        </div>
                      </div>

                      {/* Phone Column */}
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-black font-medium">{donor.phone}</span>
                      </div>

                      {/* Address Column */}
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-black font-medium truncate">{donor.address}</span>
                      </div>

                      {/* Registration Date Column */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-black font-medium">{formatDate(donor.registered_at)}</span>
                      </div>

                      {/* Actions Column */}
                      <div className="flex justify-start lg:justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditDonor(donor)}
                          className="border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDonor(donor)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Donor Information</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-bloodType">Blood Type</Label>
              <select
                id="edit-bloodType"
                value={editFormData.blood_type}
                onChange={(e) => setEditFormData({...editFormData, blood_type: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select blood type</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={editFormData.address}
                onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Donor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedDonor?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
