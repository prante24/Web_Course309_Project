import { motion } from "framer-motion";
import { useState } from "react";

/**
 * AnimatedButton - Button with micro-interactions
 */
export const AnimatedButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/**
 * AnimatedCard - Card with hover animations
 */
export const AnimatedCard = ({
  children,
  className = "",
  hoverScale = 1.03,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: hoverScale, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * FadeIn - Fade in animation wrapper
 */
export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * SlideIn - Slide in animation wrapper
 */
export const SlideIn = ({
  children,
  direction = "left",
  delay = 0,
  className = "",
}) => {
  const variants = {
    left: { x: -50, opacity: 0 },
    right: { x: 50, opacity: 0 },
    top: { y: -50, opacity: 0 },
    bottom: { y: 50, opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * PulseIcon - Pulsing icon animation
 */
export const PulseIcon = ({ children, className = "" }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * CountUp - Animated number counter
 */
export const CountUp = ({ end, duration = 2, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);

  useState(() => {
    let start = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

/**
 * ShakeOnError - Shake animation for form errors
 */
export const ShakeOnError = ({ children, trigger, className = "" }) => {
  return (
    <motion.div
      animate={
        trigger
          ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 },
            }
          : {}
      }
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * ProgressBar - Animated progress bar
 */
export const ProgressBar = ({ progress, height = "h-2", className = "" }) => {
  return (
    <div
      className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${height} ${className}`}
    >
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
};

/**
 * FloatingLabel - Floating label for inputs
 */
export const FloatingLabel = ({ label, value, children }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      {children({
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
      })}
      <motion.label
        animate={{
          top: isFocused || value ? "0.25rem" : "50%",
          fontSize: isFocused || value ? "0.75rem" : "1rem",
          y: isFocused || value ? 0 : "-50%",
        }}
        className="absolute left-3 pointer-events-none text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 px-1"
      >
        {label}
      </motion.label>
    </div>
  );
};

/**
 * Ripple - Material design ripple effect
 */
export const Ripple = ({ children, className = "" }) => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (event) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;
    const x = event.clientX - rippleContainer.left - size / 2;
    const y = event.clientY - rippleContainer.top - size / 2;
    const newRipple = { x, y, size, key: Date.now() };

    setRipples([...ripples, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== newRipple.key));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseDown={addRipple}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.key}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bg-white rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
    </div>
  );
};

/**
 * SkeletonLoader - Animated skeleton loader
 */
export const SkeletonLoader = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};
