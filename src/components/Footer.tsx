
const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} SForce Library Management System
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">
              Powered by Salesforce
            </p>
            <p className="text-sm text-gray-500">
              Implementation Demo Using React
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
