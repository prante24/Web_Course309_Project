import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Book, Star, ArrowRight, Sparkles, Medal, Timer, BarChart } from "lucide-react";

const SuccessStoriesSection = () => (
  <div className="py-20 bg-gradient-to-b dark:from-gray-900 dark:to-black">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
          Success Stories
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Discover how our students transformed their careers through dedicated learning
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: "Sarah Johnson",
            role: "Web Developer at Tech Corp",
            story: "From complete beginner to professional developer in 8 months. Now earning 3x my previous salary.",
            achievement: "Completed Full-Stack Development Track"
          },
          {
            name: "Michael Chen",
            role: "Digital Marketing Specialist",
            story: "The practical projects and mentor guidance helped me transition into digital marketing seamlessly.",
            achievement: "Achieved Google Certification"
          },
          {
            name: "Emma Williams",
            role: "UI/UX Designer",
            story: "The design courses gave me the portfolio I needed to land my dream job in Silicon Valley.",
            achievement: "Featured on Dribbble Showcase"
          }
        ].map((story, index) => (
          <Card key={index} className="hover:shadow-lg border-none transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 dark:bg-gradient-to-br dark:from-blue-400 dark:to-purple-400 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{story.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{story.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{story.story}</p>
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-500">
                <Medal className="h-4 w-4" />
                <span>{story.achievement}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const LearningPathsSection = () => (
  <div className="py-20 bg-gradient-to-b dark:from-gray-900 dark:to-black">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
          Learning Paths
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Structured learning journeys designed to take you from beginner to expert
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "Web Development",
            description: "Master modern web development from fundamentals to advanced frameworks",
            duration: "6 months",
            level: "Beginner to Advanced",
            topics: ["HTML & CSS", "JavaScript", "React", "Node.js", "MongoDB"],
            icon: Book
          },
          {
            title: "Digital Marketing",
            description: "Learn comprehensive digital marketing strategies and tools",
            duration: "4 months",
            level: "Beginner to Intermediate",
            topics: ["SEO", "Social Media", "Content Marketing", "Analytics", "PPC"],
            icon: BarChart
          }
        ].map((path, index) => (
          <Card key={index} className="hover:shadow-xl border-none transition-all duration-300 dark:bg-gray-800 dark:text-white">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <path.icon className="h-7 w-7 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{path.description}</p>
                  </div>
                  
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Timer className="h-4 w-4" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Sparkles className="h-4 w-4" />
                      <span>{path.level}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">What you'll learn:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {path.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 dark:text-yellow-300" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="group flex items-center gap-2 text-blue-600 dark:text-blue-500 font-medium hover:text-blue-700 dark:hover:text-blue-600 transition-colors">
                    Explore Path
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

const AdditionalSections = () => (
  <>
    <SuccessStoriesSection />
    <LearningPathsSection />
  </>
);

export default AdditionalSections;