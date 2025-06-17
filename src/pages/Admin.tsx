
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Droplets, Heart, Shield, Settings, ArrowLeft, UserCheck, UserX, Phone, MapPin, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveNav } from '@/components/ui/responsive-nav';
import LoginForm from '@/components/LoginForm';

interface Donor {
  id: string;
  name: string;
  phone: string;
  bloodType: string;
  address: string;
  registeredAt: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, logout, isAdmin, isAuthenticated } = useAuth();
  
  const [donors, setDonors] = useState<Donor[]>([]);

  // Load donors from localStorage
  useEffect(() => {
    const savedDonors = JSON.parse(localStorage.getItem('donors') || '[]');
    setDonors(savedDonors);
  }, []);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Calculate stats
  const totalDonors = donors.length;
  const recentDonors = donors.filter(donor => {
    const registrationDate = new Date(donor.registeredAt);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return registrationDate > thirtyDaysAgo;
  }).length;

  const bloodTypeStats = bloodTypes.map(type => ({
    type,
    count: donors.filter(donor => donor.bloodType === type).length,
    percentage: totalDonors > 0 ? ((donors.filter(donor => donor.bloodType === type).length / totalDonors) * 100).toFixed(1) : '0'
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get blood type color
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

  // Clear all donors (admin only)
  const handleClearAllDonors = () => {
    if (window.confirm('Are you sure you want to delete all donor records? This action cannot be undone.')) {
      localStorage.removeItem('donors');
      setDonors([]);
      toast({
        title: "Success",
        description: "All donor records have been cleared",
      });
    }
  };

  // Show login form if not authenticated or not admin
  if (!isAuthenticated() || !isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {!isAuthenticated() ? (
            <LoginForm />
          ) : (
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-4">You don't have admin privileges to access this page.</p>
                <Button onClick={() => navigate('/dashboard')} className="bg-red-600 hover:bg-red-700">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white pb-20 md:pb-0">
      <ResponsiveNav />

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center mb-2">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mr-3" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                System overview and management tools
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser?.name} (Admin)
              </span>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Donors</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalDonors}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">New This Month</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{recentDonors}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Blood Types</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{bloodTypes.length}</p>
                </div>
                <Droplets className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">System Status</p>
                  <p className="text-lg sm:text-xl font-bold text-green-600">Active</p>
                </div>
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Type Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Blood Type Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {bloodTypeStats.map(stat => (
                <div key={stat.type} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full text-sm sm:text-base font-bold mb-2 border ${getBloodTypeColor(stat.type)}`}>
                    {stat.type}
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-gray-900">{stat.count}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Donors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {donors.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donors registered</h3>
                <p className="text-gray-600">The system is ready to accept donor registrations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {donors.slice(-5).reverse().map(donor => (
                  <div key={donor.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4">
                    <div className="flex items-center space-x-3">
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold border ${getBloodTypeColor(donor.bloodType)}`}>
                        {donor.bloodType}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{donor.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600">
                          <span className="flex items-center"><Phone className="h-3 w-3 mr-1" />{donor.phone}</span>
                          <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" />{donor.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(donor.registeredAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-red-800">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Donors
              </Button>
              
              <Button
                variant="outline"
                onClick={handleClearAllDonors}
                className="border-red-300 text-red-700 hover:bg-red-50"
                disabled={donors.length === 0}
              >
                <UserX className="h-4 w-4 mr-2" />
                Clear All Donors
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Admin actions are permanent and cannot be undone. Use with caution.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
