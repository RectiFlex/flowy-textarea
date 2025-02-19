
import { useState } from 'react';
import { Announcement } from "@/components/ui/announcement";
import { ChevronLeft, ChevronRight, FolderKanban, Users, BookOpen, HelpCircle, MessageSquarePlus } from 'lucide-react';

const NAV_ITEMS = [
  {
    icon: MessageSquarePlus,
    title: "New Chat",
    variant: "primary"
  },
  {
    icon: FolderKanban,
    title: "Projects"
  },
  {
    icon: Users,
    title: "Community"
  },
  {
    icon: BookOpen,
    title: "Library"
  },
  {
    icon: HelpCircle,
    title: "Feedback"
  }
];

const RECENT_PROJECTS = [
  "Landing Page Design",
  "API Integration Help",
  "Next.js Auth Setup",
  "Database Schema Review",
  "Tailwind Components",
];

export function ProjectSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`relative h-screen bg-background/95 border-r border-neutral-800 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-20 rounded-full bg-primary p-1 text-primary-foreground shadow-md"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div className="h-full flex flex-col p-2">
        <nav className="space-y-2">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg text-sm ${
                item.variant === "primary" 
                  ? "bg-muted border text-foreground hover:bg-primary/90"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </button>
          ))}
        </nav>

        {!isCollapsed && (
          <>
            <div className="mt-6 pt-6 border-t border-border/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm px-2 text-muted-foreground">Recent Projects</span>
              </div>
              <div className="space-y-2">
                {RECENT_PROJECTS.map((project, index) => (
                  <button 
                    key={index} 
                    className="w-full text-left px-2 py-1 text-sm text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg"
                  >
                    {project}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <Announcement
                title="New Feature"
                description="Create and share your project templates with the community."
                href="#"
                onClose={() => console.log('Closing announcement')}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
