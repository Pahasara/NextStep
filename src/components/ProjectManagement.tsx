import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Github, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Upload,
  Image as ImageIcon,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/lib/api";

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

interface ProjectManagementProps {
  careerPath: string;
  onClose?: () => void;
}

const ProjectManagement = ({ careerPath, onClose }: ProjectManagementProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectUrl: "",
    githubUrl: "",
    technologies: "",
    imageUrls: [] as string[]
  });

  const { toast } = useToast();

  useEffect(() => {
    // Load real projects from backend
    loadProjects();
  }, [careerPath]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // Load only current user's projects
      const response = await apiService.getMyProjects();
      
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
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const projectData = {
        title: formData.title,
        description: formData.description || null,
        projectUrl: formData.projectUrl || null,
        githubUrl: formData.githubUrl || null,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
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
        
        resetForm();
        setIsDialogOpen(false);
        loadProjects(); // Reload projects
      } else {
        toast({
          title: "Error",
          description: response.message || `Failed to ${editingProject ? 'update' : 'create'} project`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingProject ? 'update' : 'create'} project`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await apiService.deleteProject(projectId);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        loadProjects(); // Reload projects
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

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      projectUrl: project.projectUrl || "",
      githubUrl: project.githubUrl || "",
      technologies: project.technologies?.join(', ') || "",
      imageUrls: project.imageUrls || []
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      projectUrl: "",
      githubUrl: "",
      technologies: "",
      imageUrls: []
    });
    setEditingProject(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you'd upload to a storage service
    // For now, we'll use placeholders
    const newImages = Array.from(files).map((_, index) => 
      `https://via.placeholder.com/400x300?text=Project+Image+${index + 1}`
    );
    
    setFormData({
      ...formData,
      imageUrls: [...formData.imageUrls, ...newImages].slice(0, 3) // Max 3 images
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My {careerPath} Projects</h2>
          <p className="text-muted-foreground">
            Showcase your work and track your progress
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter project title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your project"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectUrl">Demo URL</Label>
                    <Input
                      id="projectUrl"
                      type="url"
                      value={formData.projectUrl}
                      onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                      placeholder="https://your-demo.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies Used</Label>
                  <Input
                    id="technologies"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Node.js, MongoDB (comma separated)"
                  />
                </div>

                <div>
                  <Label>Project Images (Max 3)</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" className="w-full">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Images
                        </Button>
                      </Label>
                    </div>
                    
                    {formData.imageUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.imageUrls.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Project image ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingProject ? 'Update' : 'Add'} Project
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Simple Grid View for Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="glass-card group hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Project Images */}
                  {project.imageUrls && project.imageUrls.length > 0 && (
                    <div className="relative">
                      <img
                        src={project.imageUrls[0]}
                        alt={project.title}
                        className="w-full h-32 object-cover rounded"
                      />
                      {project.imageUrls.length > 1 && (
                        <Badge 
                          variant="secondary" 
                          className="absolute top-2 right-2"
                        >
                          +{project.imageUrls.length - 1}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex space-x-2">
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {project.projectUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}

            {projects.length === 0 && (
              <Card className="glass-card col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Start building your portfolio by adding your first project
                  </p>
                  <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Project
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
