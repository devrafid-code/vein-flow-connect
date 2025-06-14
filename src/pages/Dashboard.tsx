import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Droplets, Plus, Edit, Trash2, Search, Filter, Users, Activity, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodType: string;
  address: string;
  registeredAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState('all');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    bloodType: '',
    address: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Get blood type color
  const getBloodTypeColor = (bloodType: string) => {
    const colors = {
      'A+': 'from-red-500 to-red-600',
      'A-': 'from-blue-500 to-blue-600',
      'B+': 'from-green-500 to-green-600',
      'B-': 'from-purple-500 to-purple-600',
      'AB+': 'from-orange-500 to-orange-600',
      'AB-': 'from-pink-500 to-pink-600',
      'O+': 'from-yellow-500 to-yellow-600',
      'O-': 'from-indigo-500 to-indigo-600'
    };
    return colors[bloodType as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  // Load donors from localStorage
  useEffect(() => {
    const savedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    setDonors(savedDonors);
  }, []);

  // Filter donors
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         donor.phone.includes(searchTerm) ||
                         donor.bloodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodType = filterBloodType === 'all' || donor.bloodType === filterBloodType;
    return matchesSearch && matchesBloodType;
  });

  // Handle edit donor
  const handleEditDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setEditFormData({
      name: donor.name,
      phone: donor.phone,
      bloodType: donor.bloodType,
      address: donor.address
    });
    setShowEditDialog(true);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (!selectedDonor) return;

    // Validate form
    if (!editFormData.name || !editFormData.phone || !editFormData.bloodType || !editFormData.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const updatedDonors = donors.map(donor => 
      donor.id === selectedDonor.id 
        ? { ...donor, ...editFormData }
        : donor
    );

    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));
    setShowEditDialog(false);
    setSelectedDonor(null);
    
    toast({
      title: "Success",
      description: "Donor information updated successfully",
    });
  };

  // Handle delete donor
  const handleDeleteDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (!selectedDonor) return;

    const updatedDonors = donors.filter(donor => donor.id !== selectedDonor.id);
    setDonors(updatedDonors);
    localStorage.setItem('donors', JSON.stringify(updatedDonors));
    setShowDeleteDialog(false);
    setSelectedDonor(null);
    
    toast({
      title: "Success",
      description: "Donor deleted successfully",
    });
  };

  // Get stats
  const totalDonors = donors.length;
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
              <span className="text-2xl font-bold text-gray-900">LifeFlow Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Donor
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Donor Management</h1>
          <p className="text-xl text-gray-600">Manage and monitor your blood donor database</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalDonors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Blood Types</CardTitle>
                <Activity className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{bloodTypeStats.filter(stat => stat.count > 0).length}</div>
              <p className="text-sm text-gray-500">Different types available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Recent Registrations</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {donors.filter(donor => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(donor.registeredAt) > weekAgo;
                }).length}
              </div>
              <p className="text-sm text-gray-500">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
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
            <CardTitle>Donors ({filteredDonors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredDonors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donors found</h3>
                <p className="text-gray-600 mb-4">
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
                  <div key={donor.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      {/* Name & Blood Type Column */}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`bg-gradient-to-br ${getBloodTypeColor(donor.bloodType)} rounded-full p-2 flex items-center justify-center w-10 h-10`}>
                            <span className="text-white font-bold text-sm">{donor.bloodType}</span>
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
                        <span className="text-sm text-black font-medium">{formatDate(donor.registeredAt)}</span>
                      </div>

                      {/* Actions Column */}
                      <div className="flex justify-end space-x-2">
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
                value={editFormData.bloodType}
                onChange={(e) => setEditFormData({...editFormData, bloodType: e.target.value})}
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
