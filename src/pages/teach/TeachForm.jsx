import { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AuthContext } from '@/provider/AuthProvider';
import toast from 'react-hot-toast';

export default function TeachForm() {
  const { user } = useContext(AuthContext);
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      instructorName: user?.displayName || '',
      instructorEmail: user?.email || '',
      instructorImage: user?.photoURL || ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('https://edumanagebackend.vercel.app/reqteachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          instructorName: user?.displayName,
          instructorEmail: user?.email,
          instructorImage: user?.photoURL
        })
      });

      if (response.ok) {
        toast.success('Class submitted successfully!');
        reset();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-5 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl space-y-6">
      {/* User Information Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={user?.photoURL || '/default-avatar.png'}
            alt="User profile"
            className="h-16 w-16 rounded-full object-cover border-4 border-primary/30"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {user?.displayName || 'Instructor Profile'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {user?.email || 'instructor@example.com'}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-gray-100 mb-6">
        Create Teacher Request
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Class Image URL
          </label>
          <Input
            {...register('imageUrl', {
              required: 'Class image URL is required',
              pattern: {
                value: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
                message: 'Please enter a valid image URL'
              }
            })}
            placeholder="Paste a direct link to your class image..."
            className="w-full dark:bg-gray-700 dark:text-gray-100"
          />
          {errors.imageUrl && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.imageUrl.message}</p>
          )}
          {/* Preview Image */}
          {register('imageUrl')?.value && (
            <img
              src={register('imageUrl').value}
              alt="Class Preview"
              className="mt-4 h-64 w-full object-cover rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Class Title
          </label>
          <Input
            {...register('title', {
              required: 'Class title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' }
            })}
            placeholder="Create an engaging class title..."
            className="w-full dark:bg-gray-700 dark:text-gray-100"
          />
          {errors.title && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Class Description
          </label>
          <Controller
            name="description"
            control={control}
            rules={{
              required: 'Description is required',
              minLength: { value: 20, message: 'Description must be at least 20 characters' }
            }}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Describe your class, its objectives, and what students will learn..."
                className="w-full min-h-[120px] dark:bg-gray-700 dark:text-gray-100"
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Experience Level
          </label>
          <Controller
            name="experience"
            control={control}
            rules={{ required: 'Experience level is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-100">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.experience && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.experience.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full dark:bg-gray-700 dark:text-gray-100">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700">
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="digital-marketing">Digital Marketing</SelectItem>
                  <SelectItem value="graphic-design">Graphic Design</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="language-learning">Language Learning</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full btn transition-colors text-lg font-semibold dark:bg-primary dark:text-white dark:hover:bg-primary/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Class Proposal"}
        </Button>
      </form>
    </div>
  );
}