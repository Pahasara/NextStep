import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Star, Send, Edit, Trash2, Award, MessageSquare } from "lucide-react";
import API from "@/lib/api";

interface Rating {
  id: number;
  expertUserId: number;
  expertName: string;
  expertCompany?: string;
  expertPosition?: string;
  rating: number;
  comment?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  categoryRatings: Record<string, number>;
  recentRatings: Rating[];
}

interface StudentRatingProps {
  studentId: number;
  studentName: string;
  isExpertView?: boolean; // Whether this is viewed by an industry expert
}

const RATING_CATEGORIES = [
  "Overall",
  "Technical Skills",
  "Communication", 
  "Problem Solving",
  "Teamwork",
  "Leadership",
  "Creativity",
  "Professionalism"
];

const StudentRating = ({ studentId, studentName, isExpertView = false }: StudentRatingProps) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [myRating, setMyRating] = useState<Rating | null>(null);
  const [isRating, setIsRating] = useState(false);
  const [editingRating, setEditingRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Rating form state
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState("Overall");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const isIndustryExpert = user?.role === "industry_expert";

  useEffect(() => {
    fetchRatings();
    fetchStats();
    if (isIndustryExpert) {
      fetchMyRating();
    }
  }, [studentId, isIndustryExpert]);

  const fetchRatings = async () => {
    try {
      const response = await API.get(`/Ratings/student/${studentId}?page=1&pageSize=20`);
      if (response.success) {
        setRatings((response.data as Rating[]) || []);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/Ratings/student/${studentId}/stats`);
      if (response.success) {
        setStats(response.data as RatingStats);
      }
    } catch (error) {
      console.error("Error fetching rating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRating = async () => {
    try {
      const response = await API.get(`/Ratings/expert/student/${studentId}?category=${category}`);
      if (response.success && response.data) {
        setMyRating(response.data as Rating);
      } else {
        setMyRating(null);
      }
    } catch (error) {
      console.error("Error fetching my rating:", error);
      setMyRating(null);
    }
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      toast({
        title: "Invalid Rating",
        description: "Please select a rating from 1 to 5 stars",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const ratingData = {
        studentUserId: studentId,
        rating: selectedRating,
        comment: comment.trim() || null,
        category
      };

      let response;
      if (editingRating) {
        response = await API.put(`/Ratings/${editingRating.id}`, {
          rating: selectedRating,
          comment: comment.trim() || null,
          category
        });
      } else {
        response = await API.post("/Ratings", ratingData);
      }

      if (response.success) {
        toast({
          title: "Success",
          description: editingRating ? "Rating updated successfully" : "Rating submitted successfully",
          variant: "default"
        });

        // Reset form
        setSelectedRating(0);
        setComment("");
        setCategory("Overall");
        setIsRating(false);
        setEditingRating(null);

        // Refresh data
        await Promise.all([fetchRatings(), fetchStats(), fetchMyRating()]);
      } else {
        throw new Error(response.message || "Failed to submit rating");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRating = (rating: Rating) => {
    setEditingRating(rating);
    setSelectedRating(rating.rating);
    setComment(rating.comment || "");
    setCategory(rating.category || "Overall");
    setIsRating(true);
  };

  const handleDeleteRating = async (ratingId: number) => {
    if (!confirm("Are you sure you want to delete this rating?")) return;

    try {
      const response = await API.delete(`/Ratings/${ratingId}`);
      if (response.success) {
        toast({
          title: "Success",
          description: "Rating deleted successfully",
          variant: "default"
        });
        await Promise.all([fetchRatings(), fetchStats(), fetchMyRating()]);
      } else {
        throw new Error(response.message || "Failed to delete rating");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete rating",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      "Overall": "bg-blue-100 text-blue-800",
      "Technical Skills": "bg-green-100 text-green-800",
      "Communication": "bg-purple-100 text-purple-800",
      "Problem Solving": "bg-orange-100 text-orange-800",
      "Teamwork": "bg-pink-100 text-pink-800",
      "Leadership": "bg-red-100 text-red-800",
      "Creativity": "bg-yellow-100 text-yellow-800",
      "Professionalism": "bg-gray-100 text-gray-800"
    };
    return colors[category || "Overall"] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading ratings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Industry Expert Ratings for {studentName}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats && stats.totalRatings > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Stats */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                  <span className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {stats.totalRatings} rating{stats.totalRatings !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-3">Category Ratings</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(stats.categoryRatings).map(([category, rating]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Badge variant="outline" className={getCategoryColor(category)}>
                        {category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        {renderStars(Math.round(rating))}
                        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No ratings yet from industry experts</p>
              {isIndustryExpert && (
                <Button
                  className="mt-4"
                  onClick={() => setIsRating(true)}
                >
                  Be the first to rate this student
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Industry Expert Rating Form */}
      {isIndustryExpert && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRating ? "Edit Your Rating" : myRating ? "Update Your Rating" : "Rate This Student"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!isRating && !editingRating && myRating ? (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(myRating.category)}>
                        {myRating.category}
                      </Badge>
                      {renderStars(myRating.rating)}
                      <span className="font-medium">{myRating.rating}/5</span>
                    </div>
                    {myRating.comment && (
                      <p className="text-sm text-muted-foreground">{myRating.comment}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Rated on {new Date(myRating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditRating(myRating)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteRating(myRating.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : isRating || editingRating ? (
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RATING_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  {renderStars(selectedRating, true, setSelectedRating)}
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRating === 0 && "Click a star to rate"}
                    {selectedRating === 1 && "Poor"}
                    {selectedRating === 2 && "Fair"}
                    {selectedRating === 3 && "Good"}
                    {selectedRating === 4 && "Very Good"}
                    {selectedRating === 5 && "Excellent"}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium mb-2">Comment (Optional)</label>
                  <Textarea
                    placeholder="Share your thoughts about this student's performance..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSubmitRating}
                    disabled={submitting || selectedRating === 0}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? "Submitting..." : editingRating ? "Update Rating" : "Submit Rating"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsRating(false);
                      setEditingRating(null);
                      setSelectedRating(0);
                      setComment("");
                      setCategory("Overall");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsRating(true)}>
                Rate This Student
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Ratings */}
      {ratings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Recent Ratings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>
                          {rating.expertName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{rating.expertName}</span>
                          {rating.expertCompany && (
                            <span className="text-sm text-muted-foreground">
                              at {rating.expertCompany}
                            </span>
                          )}
                        </div>
                        {rating.expertPosition && (
                          <p className="text-sm text-muted-foreground">{rating.expertPosition}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getCategoryColor(rating.category)}>
                          {rating.category}
                        </Badge>
                        {renderStars(rating.rating)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {rating.comment && (
                    <p className="text-sm mt-3 pl-13">{rating.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentRating;
