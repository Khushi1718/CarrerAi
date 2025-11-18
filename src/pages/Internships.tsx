import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowLeft, MapPin, DollarSign, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

const Internships = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
    fetchSavedInternships();
  }, []);

  const fetchInternships = async () => {
    const { data, error } = await supabase
      .from('internships')
      .select('*')
      .order('posted_at', { ascending: false });

    if (error) {
      toast.error("Failed to load internships");
      return;
    }

    setInternships(data || []);
    setLoading(false);
  };

  const fetchSavedInternships = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('saved_internships')
      .select('internship_id')
      .eq('user_id', session.user.id);

    if (data) {
      setSavedIds(new Set(data.map(s => s.internship_id)));
    }
  };

  const toggleSave = async (internshipId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to save internships");
      return;
    }

    if (savedIds.has(internshipId)) {
      await supabase
        .from('saved_internships')
        .delete()
        .eq('user_id', session.user.id)
        .eq('internship_id', internshipId);

      setSavedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(internshipId);
        return newSet;
      });
      toast.success("Removed from saved");
    } else {
      await supabase
        .from('saved_internships')
        .insert({ user_id: session.user.id, internship_id: internshipId });

      setSavedIds(prev => new Set(prev).add(internshipId));
      toast.success("Saved successfully");
    }
  };

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
     <section id="about" className="relative  bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Animated background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/3 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
   

      <nav className="bg-card border-b">
        <div className="container mx-auto px-6 ">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Internship Opportunities
            </h1>
            <p className="text-muted-foreground">
              Discover internships matched to your skills and interests
            </p>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search by title, company, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">Loading internships...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredInternships.map((internship) => (
                <Card key={internship.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="mb-1">{internship.title}</CardTitle>
                        <CardDescription className="font-semibold text-foreground">
                          {internship.company}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleSave(internship.id)}
                      >
                        {savedIds.has(internship.id) ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{internship.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {internship.is_remote && (
                        <Badge variant="secondary">Remote</Badge>
                      )}
                      {internship.category && (
                        <Badge>{internship.category}</Badge>
                      )}
                    </div>

                    <div className="space-y-2 text-sm">
                      {internship.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {internship.location}
                        </div>
                      )}
                      {internship.stipend && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          {internship.stipend}
                        </div>
                      )}
                      {internship.duration && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {internship.duration}
                        </div>
                      )}
                    </div>

                    {internship.skills_required && internship.skills_required.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2">Required Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {internship.skills_required.map((skill: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button className="w-full mt-4">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredInternships.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No internships found matching your search.
            </div>
          )}
        </div>
      </div>
    
    </section>
  );
};

export default Internships;