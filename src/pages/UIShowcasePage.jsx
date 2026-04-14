import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AnimatedButton,
  AnimatedCard,
  FadeIn,
  SlideIn,
  PulseIcon,
  CountUp,
  ShakeOnError,
  ProgressBar,
  Ripple,
  SkeletonLoader,
} from "@/components/ui/micro-interactions";
import {
  EmptyState,
  NoClassesFound,
  NoSearchResults,
  NoUsers,
  NoTeacherRequests,
  NoAssignments,
} from "@/components/ui/empty-state";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OnboardingTour, studentDashboardTour } from "@/components/ui/onboarding-tour";
import { Heart, Star, Zap, BookOpen, Users, Award } from "lucide-react";

const UIShowcasePage = () => {
  const [showTour, setShowTour] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [progress, setProgress] = useState(65);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: "UI Showcase" },
  ];

  const triggerShake = () => {
    setShakeError(true);
    setTimeout(() => setShakeError(false), 500);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Onboarding Tour */}
      <OnboardingTour
        steps={studentDashboardTour}
        show={showTour}
        onComplete={() => setShowTour(false)}
        onSkip={() => setShowTour(false)}
        storageKey="ui-showcase-tour"
      />

      {/* Header */}
      <FadeIn>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            UI/UX Components Showcase
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Beautiful, interactive components for modern web applications
          </p>
        </div>
      </FadeIn>

      {/* Breadcrumbs Demo */}
      <section>
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumbs Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <Breadcrumbs items={breadcrumbItems} />
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Micro-interactions Demo */}
      <section>
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle>Micro-interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buttons">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="buttons">Buttons</TabsTrigger>
                  <TabsTrigger value="cards">Cards</TabsTrigger>
                  <TabsTrigger value="animations">Animations</TabsTrigger>
                  <TabsTrigger value="loaders">Loaders</TabsTrigger>
                </TabsList>

                {/* Buttons Tab */}
                <TabsContent value="buttons" className="space-y-4">
                  <div className="flex gap-4 flex-wrap">
                    <AnimatedButton variant="primary">
                      Primary Button
                    </AnimatedButton>
                    <AnimatedButton variant="secondary">
                      Secondary Button
                    </AnimatedButton>
                    <AnimatedButton disabled>Disabled Button</AnimatedButton>
                    <Ripple className="inline-block">
                      <Button>Ripple Effect</Button>
                    </Ripple>
                  </div>
                </TabsContent>

                {/* Cards Tab */}
                <TabsContent value="cards" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnimatedCard hoverScale={1.05}>
                      <Card className="h-full">
                        <CardContent className="p-6 text-center">
                          <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                          <h3 className="font-semibold mb-2 dark:text-white">Hover Me!</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Card with hover animation
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedCard>

                    <AnimatedCard hoverScale={1.08}>
                      <Card className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
                        <CardContent className="p-6 text-center">
                          <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                          <h3 className="font-semibold mb-2 dark:text-white">
                            Enhanced Scale
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            More dramatic hover effect
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedCard>

                    <AnimatedCard>
                      <Card className="h-full">
                        <CardContent className="p-6 text-center">
                          <PulseIcon>
                            <Zap className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                          </PulseIcon>
                          <h3 className="font-semibold mb-2 dark:text-white">Pulsing Icon</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Icon with pulse animation
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedCard>
                  </div>
                </TabsContent>

                {/* Animations Tab */}
                <TabsContent value="animations" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 dark:text-white">Fade In</h4>
                      <FadeIn delay={0.2}>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-gray-600 dark:text-gray-400">
                              This content fades in smoothly
                            </p>
                          </CardContent>
                        </Card>
                      </FadeIn>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 dark:text-white">Slide In</h4>
                      <SlideIn direction="right" delay={0.2}>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-gray-600 dark:text-gray-400">
                              This content slides from the right
                            </p>
                          </CardContent>
                        </Card>
                      </SlideIn>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 dark:text-white">
                        Shake on Error
                      </h4>
                      <ShakeOnError trigger={shakeError}>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              Click to trigger shake animation
                            </p>
                            <Button onClick={triggerShake}>Trigger Error</Button>
                          </CardContent>
                        </Card>
                      </ShakeOnError>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 dark:text-white">Counter</h4>
                      <Card>
                        <CardContent className="p-4 text-center">
                          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            <CountUp end={1250} suffix="+" duration={2} />
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Students Enrolled
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold dark:text-white">Progress Bar</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progress}%
                      </span>
                    </div>
                    <ProgressBar progress={progress} />
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => setProgress(Math.max(0, progress - 10))}
                      >
                        Decrease
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setProgress(Math.min(100, progress + 10))}
                      >
                        Increase
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Loaders Tab */}
                <TabsContent value="loaders" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 dark:text-white">Skeleton Loaders</h4>
                    <div className="space-y-3">
                      <SkeletonLoader className="h-12 w-full" />
                      <SkeletonLoader className="h-24 w-3/4" />
                      <SkeletonLoader className="h-16 w-1/2" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Empty States Demo */}
      <section>
        <FadeIn delay={0.3}>
          <Card>
            <CardHeader>
              <CardTitle>Empty States</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="classes">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="search">Search</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>

                <TabsContent value="classes">
                  <NoClassesFound />
                </TabsContent>

                <TabsContent value="search">
                  <NoSearchResults
                    searchTerm="React Advanced Patterns"
                    onReset={() => console.log("Reset search")}
                  />
                </TabsContent>

                <TabsContent value="users">
                  <NoUsers />
                </TabsContent>

                <TabsContent value="requests">
                  <NoTeacherRequests />
                </TabsContent>

                <TabsContent value="custom">
                  <EmptyState
                    icon={BookOpen}
                    title="Custom Empty State"
                    description="You can create custom empty states with any icon, text, and action button."
                    actionLabel="Take Action"
                    onAction={() => alert("Action clicked!")}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Onboarding Tour Demo */}
      <section>
        <FadeIn delay={0.4}>
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Interactive step-by-step guides help users learn the platform.
                Tours are stored in localStorage to prevent repetition.
              </p>
              <Button onClick={() => setShowTour(true)}>
                Start Demo Tour
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Stats Cards with Animations */}
      <section>
        <FadeIn delay={0.5}>
          <Card>
            <CardHeader>
              <CardTitle>Animated Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedCard>
                  <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
                    <Users className="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-300" />
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                      <CountUp end={5420} suffix="+" />
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Active Students</p>
                  </Card>
                </AnimatedCard>

                <AnimatedCard>
                  <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-purple-600 dark:text-purple-300" />
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                      <CountUp end={230} suffix="+" />
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Total Classes</p>
                  </Card>
                </AnimatedCard>

                <AnimatedCard>
                  <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
                    <Award className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-300" />
                    <p className="text-3xl font-bold text-green-600 dark:text-green-300">
                      <CountUp end={98} suffix="%" />
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
                  </Card>
                </AnimatedCard>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  );
};

export default UIShowcasePage;
