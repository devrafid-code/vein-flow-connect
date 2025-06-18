
import { Heart, Droplets, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from './bottom-nav';

export function ResponsiveNav() {
  const navigate = useNavigate();

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Settings,
      onClick: () => navigate('/dashboard'),
      variant: "outline" as const,
      className: "border-gray-600 text-gray-600 hover:bg-gray-50"
    },
    {
      title: "View Donors",
      icon: Users,
      onClick: () => navigate('/donors'),
      variant: "outline" as const,
      className: "border-red-600 text-red-600 hover:bg-red-50"
    },
    {
      title: "Register as Donor",
      icon: Heart,
      onClick: () => navigate('/register'),
      variant: "default" as const,
      className: "bg-red-600 hover:bg-red-700"
    }
  ];

  return (
    <>
      <nav className="relative z-20 bg-white/90 backdrop-blur-sm border-b border-red-100">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 rounded-full p-2">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">LifeFlow</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navigationItems.map((item) => (
                <Button
                  key={item.title}
                  variant={item.variant}
                  className={item.className}
                  onClick={item.onClick}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </>
  );
}
