import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Clock, Signal } from "lucide-react";
import { toast } from "sonner";

const Learn = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to load courses");
      return;
    }

    setCourses(data || []);
    setLoading(false);
  };

  const handleEnroll = async (courseId: string, isFree: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to enroll");
      navigate("/auth");
      return;
    }

    if (!isFree) {
      toast.info("Payment integration coming soon!");
      return;
    }

    const { error } = await supabase
      .from('enrolled_courses')
      .insert({ user_id: session.user.id, course_id: courseId });

    if (error) {
      if (error.code === '23505') {
        toast.info("You're already enrolled in this course");
      } else {
        toast.error("Failed to enroll");
      }
      return;
    }

    toast.success("Successfully enrolled!");
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const freeCourses = filteredCourses.filter(c => c.is_free);
  const paidCourses = filteredCourses.filter(c => !c.is_free);

  const CourseGrid = ({ courses }: { courses: any[] }) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant={course.difficulty === 'beginner' ? 'default' : course.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                {course.difficulty}
              </Badge>
              {course.is_free && (
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                  FREE
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardDescription className="text-sm">{course.instructor}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Signal className="h-4 w-4" />
                  {course.difficulty}
                </div>
              </div>

              {course.what_you_learn && course.what_you_learn.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">What you'll learn:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {course.what_you_learn.slice(0, 3).map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              {!course.is_free && (
                <p className="text-2xl font-bold mb-3">${course.price}</p>
              )}
              <Button 
                className="w-full"
                onClick={() => handleEnroll(course.id, course.is_free)}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {course.is_free ? 'Enroll Now' : 'Buy Course'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              Learning Hub
            </h1>
            <p className="text-muted-foreground">
              Expand your skills with expert-led courses
            </p>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">Loading courses...</div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Courses ({filteredCourses.length})</TabsTrigger>
                <TabsTrigger value="free">Free ({freeCourses.length})</TabsTrigger>
                <TabsTrigger value="paid">Paid ({paidCourses.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {filteredCourses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No courses found matching your search.
                  </div>
                ) : (
                  <CourseGrid courses={filteredCourses} />
                )}
              </TabsContent>

              <TabsContent value="free">
                {freeCourses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No free courses available.
                  </div>
                ) : (
                  <CourseGrid courses={freeCourses} />
                )}
              </TabsContent>

              <TabsContent value="paid">
                {paidCourses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No paid courses available.
                  </div>
                ) : (
                  <CourseGrid courses={paidCourses} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn;