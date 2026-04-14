import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthContext } from "@/provider/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiShield,
  FiCalendar,
  FiInfo,
  FiAlertCircle,
  FiArrowLeft,
  FiDollarSign
} from "react-icons/fi"
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiDiscover
} from "react-icons/si"
import { FadeIn, SkeletonLoader } from "@/components/ui/micro-interactions"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"

const PaymentPage = () => {
  const [classDetails, setClassDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [cardType, setCardType] = useState("")
  const [focusedField, setFocusedField] = useState("")

  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchClassDetails = async () => {
      setPageLoading(true)
      try {
        const response = await axios.get(`https://edumanagebackend.vercel.app/classes/${id}`)
        setClassDetails(response.data)
      } catch (error) {
        setError("Failed to load class details. Please try again.")
      } finally {
        setPageLoading(false)
      }
    }
    fetchClassDetails()
  }, [id])

  // Detect card type based on number
  useEffect(() => {
    const number = paymentInfo.cardNumber.replace(/\s/g, '')
    if (/^4/.test(number)) {
      setCardType('visa')
    } else if (/^5[1-5]/.test(number)) {
      setCardType('mastercard')
    } else if (/^3[47]/.test(number)) {
      setCardType('amex')
    } else if (/^6(?:011|5)/.test(number)) {
      setCardType('discover')
    } else {
      setCardType('')
    }
  }, [paymentInfo.cardNumber])

  const validateForm = () => {
    const errors = {}

    const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '')
    if (!/^\d{16}$/.test(cardNumber)) {
      errors.cardNumber = "Card number must be 16 digits"
    }

    if (!paymentInfo.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required"
    }

    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      errors.expiryDate = "Expiry date must be in MM/YY format"
    } else {
      const [month, year] = paymentInfo.expiryDate.split('/')
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        errors.expiryDate = "Invalid month"
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiryDate = "Card has expired"
      }
    }

    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.cvv = "CVV must be 3-4 digits"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces
    if (name === "cardNumber") {
      const digits = value.replace(/\s/g, '').replace(/\D/g, '')
      formattedValue = digits.match(/.{1,4}/g)?.join(' ') || digits
    }

    // Auto-add slash in expiry date
    if (name === "expiryDate") {
      const digits = value.replace(/\D/g, '')
      if (digits.length >= 2) {
        formattedValue = digits.slice(0, 2) + (digits.length > 2 ? '/' + digits.slice(2, 4) : '')
      } else {
        formattedValue = digits
      }
    }

    // Only allow digits for CVV
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, '')
    }

    // Capitalize cardholder name
    if (name === "cardholderName") {
      formattedValue = value.toUpperCase()
    }

    setPaymentInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }))

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      setError("Please correct the errors before submitting.")
      return
    }

    setLoading(true)
    try {
      const paymentResponse = await axios.post("https://edumanagebackend.vercel.app/api/payments", {
        classId: id,
        userId: user?.uid,
        amount: classDetails?.price,
        ...paymentInfo
      });

      if (paymentResponse.data.success) {
        setSuccess(true)

        // Wait for success animation
        setTimeout(async () => {
          try {
            await axios.post("https://edumanagebackend.vercel.app/enroll", {
              classId: id,
              userId: user?.uid
            });

            // Navigate after successful enrollment
            setTimeout(() => {
              navigate("/dashboard/my-enroll-class");
            }, 1500);
          } catch (enrollError) {
            setError("Payment successful but enrollment failed. Please contact support.");
            console.error("Enrollment error:", enrollError);
            setSuccess(false)
          }
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Payment failed. Please try again.";
      setError(errorMessage);
      console.error("Payment error:", error.response?.data);
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  const getCardIcon = (type) => {
    const iconClass = "w-8 h-8"
    switch (type) {
      case 'visa': return <SiVisa className={iconClass} />
      case 'mastercard': return <SiMastercard className={iconClass} />
      case 'amex': return <SiAmericanexpress className={iconClass} />
      case 'discover': return <SiDiscover className={iconClass} />
      default: return <FiCreditCard className={iconClass} />
    }
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <SkeletonLoader className="h-8 w-48 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8">
            <SkeletonLoader className="h-[600px] rounded-2xl" />
            <SkeletonLoader className="h-[600px] rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!classDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Class not found</p>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "All Classes", href: "/all-classes" },
    { label: classDetails.title, href: `/all-classes/${id}` },
    { label: "Payment" }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group mb-4"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <Breadcrumbs items={breadcrumbItems} className="mb-4" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Secure Checkout
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Complete your purchase securely</p>
          </div>
        </FadeIn>

        {/* Success Modal */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <FiCheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                  You&apos;ve been enrolled in the course. Redirecting to your dashboard...
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <FadeIn delay={0.1}>
            <Card className="border-none shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                    <FiCreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Details</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enter your card information</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6"
                    >
                      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                        <FiAlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <AlertDescription className="text-red-800 dark:text-red-200">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cardholder Name */}
                  <div>
                    <Label htmlFor="cardholderName" className="text-gray-900 dark:text-white font-medium">
                      Cardholder Name
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={paymentInfo.cardholderName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("cardholderName")}
                        onBlur={() => setFocusedField("")}
                        placeholder="JOHN DOE"
                        className={`h-12 pl-4 pr-4 bg-gray-50 dark:bg-gray-800 border-2 transition-all duration-300 ${focusedField === "cardholderName"
                          ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20"
                          : validationErrors.cardholderName
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                          }`}
                        required
                      />
                    </div>
                    {validationErrors.cardholderName && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        {validationErrors.cardholderName}
                      </motion.p>
                    )}
                  </div>

                  {/* Card Number */}
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-900 dark:text-white font-medium">
                      Card Number
                    </Label>
                    <div className="relative mt-2">
                      <Input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("cardNumber")}
                        onBlur={() => setFocusedField("")}
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className={`h-12 pl-4 pr-14 bg-gray-50 dark:bg-gray-800 border-2 transition-all duration-300 ${focusedField === "cardNumber"
                          ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20"
                          : validationErrors.cardNumber
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-200 dark:border-gray-700"
                          }`}
                        required
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        {getCardIcon(cardType)}
                      </div>
                    </div>
                    {validationErrors.cardNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 flex items-center gap-1"
                      >
                        <FiAlertCircle className="w-4 h-4" />
                        {validationErrors.cardNumber}
                      </motion.p>
                    )}
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-900 dark:text-white font-medium">
                        Expiry Date
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("expiryDate")}
                          onBlur={() => setFocusedField("")}
                          maxLength={5}
                          placeholder="MM/YY"
                          className={`h-12 pl-4 pr-10 bg-gray-50 dark:bg-gray-800 border-2 transition-all duration-300 ${focusedField === "expiryDate"
                            ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20"
                            : validationErrors.expiryDate
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-200 dark:border-gray-700"
                            }`}
                          required
                        />
                        <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      </div>
                      {validationErrors.expiryDate && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.expiryDate}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvv" className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                        CVV
                        <div className="group relative">
                          <FiInfo className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            3-4 digits on back of card
                          </div>
                        </div>
                      </Label>
                      <div className="relative mt-2">
                        <Input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField("cvv")}
                          onBlur={() => setFocusedField("")}
                          maxLength={4}
                          placeholder="123"
                          className={`h-12 pl-4 pr-10 bg-gray-50 dark:bg-gray-800 border-2 transition-all duration-300 ${focusedField === "cvv"
                            ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20"
                            : validationErrors.cvv
                              ? "border-red-500 dark:border-red-500"
                              : "border-gray-200 dark:border-gray-700"
                            }`}
                          required
                        />
                        <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      </div>
                      {validationErrors.cvv && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-2 flex items-center gap-1"
                        >
                          <FiAlertCircle className="w-4 h-4" />
                          {validationErrors.cvv}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <FiShield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                        Your payment is secure
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        We use 256-bit SSL encryption to protect your data
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={loading || success}
                      className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          Processing Payment...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FiLock className="w-5 h-5" />
                          Pay ${classDetails.price}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Order Summary */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              {/* Course Card */}
              <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={classDetails.image || "/placeholder.svg"}
                    alt={classDetails.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-900 dark:text-white border-none">
                    {classDetails.category}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {classDetails.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={classDetails.instructorImage || "/placeholder-avatar.svg"}
                      alt={classDetails.instructorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {classDetails.instructorName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Instructor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary */}
              <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FiDollarSign className="w-5 h-5" />
                    Order Summary
                  </h3>

                  <div className="space-y-3 py-4 border-t border-b border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Course Price</span>
                      <span className="font-semibold">${classDetails.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Processing Fee</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${classDetails.price}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-start gap-2">
                      <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                          Lifetime Access
                        </p>
                        <p>Access this course anytime, anywhere, forever</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800">
                  <FiShield className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 p-4 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800">
                  <FiCheckCircle className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Money Back</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage