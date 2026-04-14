import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Heart, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon: Icon, title, description }) => (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
            <div className="mb-4 inline-block rounded-full p-3 bg-blue-50 dark:bg-gray-700">
                <Icon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 dark:text-white ">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </CardContent>
    </Card>
);

const TeacherRecruitmentSection = () => {
    return (
        <div className="py-20 bg-gradient-to-b dark:from-gray-900 dark:to-black">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 bg-clip-text text-transparent">
                        Join Our Teaching Community
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Transform lives through education while building your teaching career with us
                    </p>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    {/* Left side - Image and Stats */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <img
                                src="https://i.postimg.cc/SNvJSzk1/teacher-5322852-1280.webp"
                                alt="Teacher teaching"
                                className="w-full object-cover"
                            />
                            
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%]">
                            <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800 dark:text-white backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-500">5+</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Teachers</p>
                                        </div>
                                        <div className="text-center border-x border-gray-200 dark:border-gray-700">
                                            <h4 className="text-2xl font-bold text-purple-600 dark:text-purple-500">2+</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Students Taught</p>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">95%</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right side - Benefits */}
                    <div className="space-y-6 lg:pl-8">
                        <h3 className="text-2xl font-bold mb-8 dark:text-white ">Why Teach With Us?</h3>

                        <div className="space-y-4">
                            {[
                                {
                                    icon: Target,
                                    title: "Reach Global Students",
                                    description: "Connect with learners worldwide and share your expertise across borders."
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Grow Your Income",
                                    description: "Set your own rates and earn from multiple revenue streams through our platform."
                                },
                                {
                                    icon: Calendar,
                                    title: "Flexible Schedule",
                                    description: "Create your own teaching schedule that fits perfectly with your lifestyle."
                                },
                                {
                                    icon: Heart,
                                    title: "Supportive Community",
                                    description: "Join a network of passionate educators and get support when you need it."
                                }
                            ].map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="inline-flex flex-col items-center">
                        <h3 className="text-2xl font-bold mb-4 dark:text-white">Ready to Start Teaching?</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl">
                            Join our community of educators and start impacting lives today. We provide all the tools you need to succeed.
                        </p>
                        <Link to='/teach'>
                            <button className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                                Become a Teacher
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherRecruitmentSection;