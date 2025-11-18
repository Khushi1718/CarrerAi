import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LogOut, BookOpen, Briefcase, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Fetch latest assessment
    const { data: assessmentData } = await supabase
      .from('user_assessments')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    setAssessment(assessmentData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                CareerAI
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/internships")}>
                <Briefcase className="h-4 w-4 mr-2" />
                Internships
              </Button>
              <Button variant="ghost" onClick={() => navigate("/learn")}>
                <BookOpen className="h-4 w-4 mr-2" />
                Learn
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mb-8">
            Your personalized career dashboard
          </p>

          {!assessment ? (
            <Card className="mb-8 shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Complete Your Career Assessment
                </CardTitle>
                <CardDescription>
                  Get AI-powered recommendations tailored to your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/assessment")}
                  className="w-full sm:w-auto"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Your AI Career Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assessment.ai_suggestions?.careerPath && (
                    <div>
                      <h3 className="font-semibold mb-2">Career Path</h3>
                      <p className="text-muted-foreground">{assessment.ai_suggestions.careerPath}</p>
                    </div>
                  )}

                  {assessment.ai_suggestions?.skillRecommendations && (
                    <div>
                      <h3 className="font-semibold mb-2">Recommended Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {assessment.ai_suggestions.skillRecommendations.map((skill: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {assessment.ai_suggestions?.learningRoadmap && (
                    <div>
                      <h3 className="font-semibold mb-2">Learning Roadmap</h3>
                      <ol className="space-y-2">
                        {assessment.ai_suggestions.learningRoadmap.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-bold text-primary">{i + 1}.</span>
                            <span className="text-muted-foreground">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/internships")}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Browse Internships
                    </CardTitle>
                    <CardDescription>
                      Find opportunities matched to your profile
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/learn")}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Explore Courses
                    </CardTitle>
                    <CardDescription>
                      Learn new skills with curated courses
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;