import { ShieldCheck, Lock, CreditCard, UserCheck } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* Card Container */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-6 sm:p-8 md:p-12 transition-colors duration-300">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold 
              bg-gradient-to-r from-yellow-500 to-yellow-700 
              bg-clip-text text-transparent">
              Privacy Policy
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              At <span className="font-semibold text-yellow-600 dark:text-yellow-500">BuyToro</span>, 
              your privacy and trust are our top priority.
            </p>

            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">

            {/* Data Protection */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Data Protection
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  We do not sell, rent, or share your personal data with
                  third parties without your consent.
                </p>
              </div>
            </div>

            {/* Secure Storage */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Secure Storage
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Your information is stored securely using industry-standard
                  encryption and security practices.
                </p>
              </div>
            </div>

            {/* Payment Security */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Payment Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Payment details are encrypted and processed securely
                  through trusted payment providers.
                </p>
              </div>
            </div>

            {/* User Rights */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Your Rights
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  You may request access, correction, or deletion of your
                  personal data at any time.
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you have questions about our privacy practices,
              feel free to contact our support team.
            </p>
          
          </div>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
