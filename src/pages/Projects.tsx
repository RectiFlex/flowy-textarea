
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ProjectSidebar } from "@/components/ProjectSidebar";

interface Project {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive"
        });
        return;
      }

      setProjects(data || []);
      setLoading(false);
    };

    fetchProjects();
  }, [navigate]);

  const createNewProject = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: 'New Project',
        description: 'Start building something amazing',
        user_id: session.session.user.id
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
      return;
    }

    if (data) {
      setProjects(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Project created successfully"
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <ProjectSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Your Projects</h1>
            <button
              onClick={createNewProject}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <>
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl text-white/80 mb-4">No projects yet</h3>
                  <p className="text-white/60">
                    Create your first project to get started
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="group relative p-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {project.title}
                      </h3>
                      {project.description && (
                        <p className="text-white/60 text-sm mb-4">
                          {project.description}
                        </p>
                      )}
                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg border border-white/20 text-sm"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
