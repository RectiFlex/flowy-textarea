
import { useState, useCallback } from 'react';
import { MessageSquarePlus, FolderKanban, Users, BookOpen, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const NAV_ITEMS = [
  {
    icon: MessageSquarePlus,
    title: "New Chat",
    variant: "primary",
    path: "/"
  },
  {
    icon: FolderKanban,
    title: "Projects",
    path: "/projects"
  },
  {
    icon: Users,
    title: "Community",
    path: "/community"
  },
  {
    icon: BookOpen,
    title: "Library",
    path: "/library"
  },
  {
    icon: HelpCircle,
    title: "Feedback",
    path: "/feedback"
  }
];

export function ProjectSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMouseEnter = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-4 left-4 h-[calc(100vh-2rem)] backdrop-blur-xl bg-background/5 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out rounded-2xl ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="h-full flex flex-col p-2">
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg text-sm transition-colors ${
                item.variant === "primary" 
                  ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className={`transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0' : 'opacity-100'
              }`}>
                {item.title}
              </span>
            </button>
          ))}
        </nav>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 py-2 px-2 rounded-lg text-sm transition-colors text-white/90 hover:bg-white/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={`transition-opacity duration-200 ${
            isCollapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}
