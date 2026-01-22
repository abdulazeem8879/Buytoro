const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

      <p className="text-gray-700 mb-3">
        By using BuyToro, you agree to the following terms and conditions.
      </p>

      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Products are for personal use only</li>
        <li>Prices can change without notice</li>
        <li>Orders once placed cannot be cancelled after shipping</li>
        <li>Misuse of platform may lead to account suspension</li>
      </ul>
    </div>
  );
};

export default Terms;
