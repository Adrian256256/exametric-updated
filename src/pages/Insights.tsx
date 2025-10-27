import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Award, Users } from "lucide-react";

interface StudentScore {
  id: string;
  studentName: string;
  assessmentType: "Oral" | "Written";
  score: number;
}

    
    interface StudentScore {
      id: string;
      studentName: string;
      assessmentType: "Oral" | "Written";
      score: number;
    }

    const Insights = () => {
      const [scores, setScores] = useState<StudentScore[]>([]);

      useEffect(() => {
        const savedScores = localStorage.getItem("scores");
        if (savedScores) setScores(JSON.parse(savedScores));
      }, []);

      const calculateStats = () => {
        const oralScores = scores.filter(s => s.assessmentType === "Oral");
        const writtenScores = scores.filter(s => s.assessmentType === "Written");
    
        const oralAvg = oralScores.length > 0 
          ? oralScores.reduce((acc, s) => acc + s.score, 0) / oralScores.length 
          : 0;
        const writtenAvg = writtenScores.length > 0 
          ? writtenScores.reduce((acc, s) => acc + s.score, 0) / writtenScores.length 
          : 0;

        return {
          oralAvg: Number(oralAvg.toFixed(2)),
          writtenAvg: Number(writtenAvg.toFixed(2)),
        };
      };

      const stats = calculateStats();

      const chartData = [
        { name: "Oral", average: stats.oralAvg },
        { name: "Written", average: stats.writtenAvg },
      ];

      return (
        <div className="min-h-screen flex flex-col">
          <Navigation />

          <main className="flex-1 container py-12">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Research Insights</h1>
              <p className="text-muted-foreground text-lg">Comprehensive analysis of assessment performance and student preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
              <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Oral Average</CardTitle>
                  <Award className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{stats.oralAvg}</div>
                  <p className="text-sm text-muted-foreground mt-2">Out of 100</p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-accent">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Written Average</CardTitle>
                  <Award className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-accent">{stats.writtenAvg}</div>
                  <p className="text-sm text-muted-foreground mt-2">Out of 100</p>
                </CardContent>
              </Card>

              <Card className="shadow-card hover:shadow-elevated transition-shadow border-l-4 border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{scores.length}</div>
                  <p className="text-sm text-muted-foreground mt-2">Recorded scores</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="shadow-card hover:shadow-elevated transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Performance Comparison</CardTitle>
                  <CardDescription className="text-base">Average scores by assessment type</CardDescription>
                </CardHeader>
                <CardContent>
                  {scores.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                          }} 
                        />
                        <Bar dataKey="average" fill="hsl(var(--primary))" name="Average Score" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No performance data available yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>

          <Footer />
        </div>
      );
    };

    export default Insights;
