import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import apiService from "@/lib/api";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github, 
  Calendar,
  Loader2,
  FileImage,
  X
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description?: string;
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  imageUrls?: string[];
  createdAt: string;
  userName: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  projectUrl: string;
  githubUrl: string;
  technologies: string[];
  imageUrls: string[];
}

interface ProjectManagerProps {
  userId?: number;
  showOnlyOwn?: boolean;
  allowEdit?: boolean;
}

const ProjectManager = ({ userId, showOnlyOwn = true, allowEdit = true }: ProjectManagerProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    projectUrl: '',
    githubUrl: '',
    technologies: [],
    imageUrls: []
  });
  const [newTechnology, setNewTechnology] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      let response;
      if (showOnlyOwn) {
        // Use the user-specific endpoint for current user's projects
        response = await apiService.getMyProjects();
      } else if (userId) {
        // Use the general endpoint with specific userId (for admin/public views)
        response = await apiService.getProjects(userId);
      } else {
        // Use general endpoint (for public project views)
        response = await apiService.getProjects();
      }
      
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      projectUrl: '',
      githubUrl: '',
      technologies: [],
      imageUrls: []
    });
    setNewTechnology('');
    setNewImageUrl('');
    setEditingProject(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description || '',
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      technologies: project.technologies || [],
      imageUrls: project.imageUrls || []
    });
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.imageUrls.includes(newImageUrl.trim()) && formData.imageUrls.length < 3) {
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const projectData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        projectUrl: formData.projectUrl.trim() || null,
        githubUrl: formData.githubUrl.trim() || null,
        technologies: formData.technologies.length > 0 ? formData.technologies : null,
        imageUrls: formData.imageUrls.length > 0 ? formData.imageUrls : null
      };

      let response;
      if (editingProject) {
        response = await apiService.updateProject(editingProject.id, projectData);
      } else {
        response = await apiService.createProject(projectData);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: `Project ${editingProject ? 'updated' : 'created'} successfully`,
        });
        
        // If creating a new project, check for achievements
        if (!editingProject) {
          try {
            const achievementResponse = await apiService.checkAndAwardAchievements();
            if (achievementResponse.success && achievementResponse.data && achievementResponse.data.length > 0) {
              // Show achievement notifications
              setTimeout(() => {
                achievementResponse.data.forEach((achievement: any, index: number) => {
                  setTimeout(() => {
                    toast({
                      title: "🎉 Achievement Unlocked!",
                      description: `${achievement.title} - +${achievement.xpEarned} XP`,
                      duration: 5000,
                    });
                  }, index * 1000);
                });
              }, 500);
            }
          } catch (error) {
            console.error('Error checking achievements:', error);
          }
        }
        
        closeDialog();
        fetchProjects();
      } else {
        toast({
          title: "Error",
          description: response.message || `Failed to ${editingProject ? 'update' : 'create'} project`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingProject ? 'update' : 'create'} project`,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await apiService.deleteProject(projectId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        fetchProjects();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete project",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOwner = (project: Project) => {
    return user && project.userName === user.fullName;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Projects</h2>
          <p className="text-muted-foreground">Showcase your work and track your progress</p>
        </div>
        {allowEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update your project details' : 'Share your latest work with the community'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your project, its purpose, and key features"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectUrl">Live Demo URL</Label>
                    <Input
                      id="projectUrl"
                      type="url"
                      value={formData.projectUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                      placeholder="https://your-project.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub Repository</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-2">
                  <Label>Technologies Used</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      placeholder="Add technology (e.g., React, Node.js)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tech}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTechnology(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Image URLs */}
                <div className="space-y-2">
                  <Label>Project Images (max 3)</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Add image URL"
                      disabled={formData.imageUrls.length >= 3}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
                    />
                    <Button 
                      type="button" 
                      onClick={addImageUrl} 
                      variant="outline"
                      disabled={formData.imageUrls.length >= 3}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded">
                        <FileImage className="w-4 h-4" />
                        <span className="flex-1 text-sm truncate">{url}</span>
                        <X 
                          className="w-4 h-4 cursor-pointer" 
                          onClick={() => removeImageUrl(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-4">
              <div className="text-muted-foreground text-lg">No projects yet</div>
              {allowEdit && (
                <div className="text-sm text-muted-foreground">
                  Start building your portfolio by adding your first project!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="glass-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(project.createdAt)}</span>
                    </CardDescription>
                  </div>
                  {allowEdit && isOwner(project) && (
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(project)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex space-x-2">
                  {project.projectUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Demo
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-3 h-3 mr-1" />
                        Code
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
