import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Project {
  id: string;
  project_name: string;
  project_code: string | null;
  project_type: string;
  implementing_agency: string | null;
  state: string;
  districts_covered: string[];
  project_phase: string;
  notification_date: string | null;
  expected_completion_date: string | null;
  budget_crores: number | null;
  land_required_hectares: number | null;
  alignment_geojson: any | null;
  buffer_distance_meters: number | null;
  is_active: boolean | null;
}

interface UseRealtimeProjectsOptions {
  enabled?: boolean;
  filters?: {
    type?: string;
    phase?: string;
    state?: string;
  };
  onNewProject?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
}

export function useRealtimeProjects(options: UseRealtimeProjectsOptions = {}) {
  const {
    enabled = true,
    filters = {},
    onNewProject,
    onUpdateProject,
    onDeleteProject
  } = options;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Fetch initial projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("infrastructure_projects")
        .select("*")
        .eq("is_active", true)
        .order("notification_date", { ascending: false });

      if (filters.type && filters.type !== "all") {
        query = query.eq("project_type", filters.type as any);
      }
      if (filters.phase && filters.phase !== "all") {
        query = query.eq("project_phase", filters.phase as any);
      }
      if (filters.state && filters.state !== "all") {
        query = query.eq("state", filters.state);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProjects(data || []);
      setLastUpdate(new Date());
      console.log(`[Realtime] Fetched ${data?.length || 0} projects`);
    } catch (err) {
      console.error("[Realtime] Error fetching projects:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters.type, filters.phase, filters.state]);

  // Handle realtime changes
  const handleRealtimeChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Project>) => {
      console.log("[Realtime] Change received:", payload.eventType, payload);
      setLastUpdate(new Date());

      switch (payload.eventType) {
        case "INSERT": {
          const newProject = payload.new as Project;

          // Check if project matches current filters
          if (newProject.is_active) {
            const matchesFilters =
              (!filters.type || filters.type === "all" || newProject.project_type === filters.type) &&
              (!filters.phase || filters.phase === "all" || newProject.project_phase === filters.phase) &&
              (!filters.state || filters.state === "all" || newProject.state === filters.state);

            if (matchesFilters) {
              setProjects(prev => [newProject, ...prev]);

              toast.success("New Project Added", {
                description: `${newProject.project_name} has been added to the map`,
                duration: 4000,
              });

              onNewProject?.(newProject);
            }
          }
          break;
        }

        case "UPDATE": {
          const updatedProject = payload.new as Project;

          setProjects(prev => {
            const index = prev.findIndex(p => p.id === updatedProject.id);

            // Check if still matches filters
            const matchesFilters =
              updatedProject.is_active &&
              (!filters.type || filters.type === "all" || updatedProject.project_type === filters.type) &&
              (!filters.phase || filters.phase === "all" || updatedProject.project_phase === filters.phase) &&
              (!filters.state || filters.state === "all" || updatedProject.state === filters.state);

            if (index !== -1) {
              if (matchesFilters) {
                // Update existing project
                const newProjects = [...prev];
                newProjects[index] = updatedProject;
                return newProjects;
              } else {
                // Remove from list (no longer matches filters)
                return prev.filter(p => p.id !== updatedProject.id);
              }
            } else if (matchesFilters) {
              // Add to list (now matches filters)
              return [updatedProject, ...prev];
            }

            return prev;
          });

          toast.info("Project Updated", {
            description: `${updatedProject.project_name} has been updated`,
            duration: 3000,
          });

          onUpdateProject?.(updatedProject);
          break;
        }

        case "DELETE": {
          const deletedId = payload.old?.id;
          if (deletedId) {
            setProjects(prev => prev.filter(p => p.id !== deletedId));

            toast.info("Project Removed", {
              description: "A project has been removed from the map",
              duration: 3000,
            });

            onDeleteProject?.(deletedId);
          }
          break;
        }
      }
    },
    [filters.type, filters.phase, filters.state, onNewProject, onUpdateProject, onDeleteProject]
  );

  // Set up realtime subscription
  useEffect(() => {
    if (!enabled) return;

    // Fetch initial data
    fetchProjects();

    // Subscribe to realtime changes
    console.log("[Realtime] Setting up subscription for infrastructure_projects");

    const channel = supabase
      .channel("infrastructure_projects_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "infrastructure_projects",
        },
        handleRealtimeChange
      )
      .subscribe((status) => {
        console.log("[Realtime] Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("[Realtime] Successfully subscribed to infrastructure_projects");
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("[Realtime] Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchProjects, handleRealtimeChange]);



  return {
    projects,
    isLoading,
    error,
    lastUpdate,
    refetch: fetchProjects,
  };
}

export default useRealtimeProjects;
