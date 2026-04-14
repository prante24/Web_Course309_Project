import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiUsers, FiClock, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const PopularClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("https://edumanagebackend.vercel.app/classes?status=approved");
        const sortedClasses = response.data.classes
          .sort((a, b) => b.totalEnrollment - a.totalEnrollment)
          .slice(0, 6);
        setClasses(sortedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const LoadingSkeleton = () => (
    <Card className="h-full">
      <Skeleton className="w-full h-48" />
      <CardContent className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-12  ">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto py-12  dark:bg-gray-900 dark:text-white"
    >
      <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
        Popular Classes
        <span className="block text-lg font-normal text-gray-600 mt-2 dark:text-gray-300">
          Discover our most enrolled courses
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card
            key={classItem._id}
            className="h-full group hover:shadow-lg transition-all duration-300 dark:bg-gray-700 dark:border-gray-600"
          >
            <div className="relative">
              <img
                src={classItem.image}
                alt={classItem.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className="absolute top-2 right-2 bg-primary/90 dark:bg-gray-700">
                {classItem.category}
              </Badge>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold line-clamp-1 dark:text-white">
                  {classItem.title}
                </h3>
                <div className="flex items-center gap-1">
                  <FiStar className="text-yellow-500 dark:text-yellow-300" />
                  <span className="dark:text-white">
                    {classItem.rating || "4.5"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={classItem.instructorImage || "/placeholder-avatar.svg"}
                  alt={classItem.instructorName}
                  className="w-8 h-8 rounded-full dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-300">
                  {classItem.instructorName}
                </span>
              </div>

              <p className="text-gray-600 line-clamp-2 dark:text-gray-300">
                {classItem.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <FiUsers />
                  <span>{classItem.totalEnrollment} enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock />
                  <span>{classItem.duration || "8 weeks"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t dark:border-gray-600">
                <span className="text-2xl font-bold text-primary dark:text-white">
                  ${classItem.price}
                </span>
                <Link to={`/all-classes/${classItem._id}`}>
                  <Button className="bg-primary hover:bg-primary/90 transition-colors  dark:bg-primary dark:text-white ">
                    Enroll Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopularClasses;