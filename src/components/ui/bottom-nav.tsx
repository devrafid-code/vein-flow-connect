
import { Heart, Droplets, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      title: "Home",
      icon: Droplets,
      onClick: () => navigate('/'),
      path: '/'
    },
    {
      title: "Donors",
      icon: Users,
      onClick: () => navigate('/donors'),
      path: '/donors'
    },
    {
      title: "Register",
      icon: Heart,
      onClick: () => navigate('/register'),
      path: '/register'
    },
    {
      title: "Dashboard",
      icon: Settings,
      onClick: () => navigate('/dashboard'),
      path: '/dashboard'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.title}
              variant="ghost"
              className={cn(
                "h-full rounded-none flex flex-col items-center justify-center gap-1 py-2 px-1",
                isActive 
                  ? "text-red-600 bg-red-50" 
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              )}
              onClick={item.onClick}
            >
              <item.icon className={cn(
                "h-5 w-5",
                isActive ? "text-red-600" : "text-gray-600"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-red-600" : "text-gray-600"
              )}>
                {item.title}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
