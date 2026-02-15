import { ShieldCheck, Truck, DollarSign, User } from "lucide-react";

const Terms = () => {
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
              Terms & Conditions
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Welcome to <span className="font-semibold text-yellow-600 dark:text-yellow-500">BuyToro</span> — 
              Your Trusted Luxury Watch Destination.
            </p>

            <div className="w-20 h-1 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">

            {/* Personal Use */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Personal Use Only
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  All watches purchased from BuyToro are intended for personal use only.
                  Unauthorized resale is strictly prohibited.
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Pricing & Availability
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Prices and availability may change without prior notice due to 
                  stock updates or market conditions.
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Shipping Policy
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Once an order has been shipped, it cannot be cancelled.
                  Please review your order carefully before confirming.
                </p>
              </div>
            </div>

            {/* Account Responsibility */}
            <div className="group flex gap-4 p-6 rounded-2xl 
              bg-gray-100 dark:bg-gray-800 
              hover:shadow-lg hover:-translate-y-1 
              transition-all duration-300">

              <User className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 dark:text-yellow-500 shrink-0" />

              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                  Account Responsibility
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Any misuse, fraud, or violation of policies may result in
                  temporary or permanent account suspension.
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Have questions? Contact our customer support team anytime.
            </p>
         
          </div>

        </div>
      </div>
    </div>
  );
};

export default Terms;
