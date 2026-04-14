import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920",
            title: "Transform Your Learning Experience",
            description: "Join thousands of students mastering new skills with expert-led courses",
            buttonText: "Explore Classes",
            alt: "Online Learning"
        },
        {
            image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1920",
            title: "Live Interactive Sessions",
            description: "Learn from industry experts with real-time feedback and support",
            buttonText: "Explore Classes",
            alt: "Interactive Classes"
        },
        {
            image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1920",
            title: "Become an Instructor",
            description: "Share your knowledge with millions of eager learners worldwide",
            buttonText: "Explore Classes",
            alt: "Expert Instructors"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <section className="banner relative w-full h-[480px] sm:h-[520px] md:h-[550px] lg:h-[600px] xl:h-[650px] ">
            <div className="relative w-full h-full overflow-hidden">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <img
                            src={slide.image}
                            className="w-full h-full object-cover absolute inset-0"
                            alt={slide.alt}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center">
                            <div className="text-white px-10 sm:px-8 md:px-16 max-w-2xl space-y-4">
                                <h2 className="text-2xl  sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                                    {slide.title}
                                </h2>
                                <p className="text-base  sm:text-lg md:text-xl lg:text-2xl">
                                    {slide.description}
                                </p>
                                <button className="btn btn-primary  text-white mt-4">
                                    {slide.buttonText}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-primary' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={handlePrevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost z-50"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
                onClick={handleNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-ghost z-50"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

        </section>
    );
};

export default Banner;