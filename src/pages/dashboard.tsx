// Add console logs to debug
useEffect(() => {
  console.log("Dashboard mounted, user:", user);
  if (!user && !isLoading) {
    console.log("No user found, redirecting to login");
    navigate("/");
  }
}, [user, isLoading, navigate]);

// Make sure your JSX is properly checking for user existence
return (
  <div className="min-h-screen bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] py-8 px-4">
    {isLoading ? (
      <div className="text-center py-8 text-white">Loading...</div>
    ) : user ? (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-[#24243e]/50 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <img 
              src={logo}
              alt="Dhani Finance DMI" 
              className="h-10 mr-3" 
            />
            <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
          </div>
          {/* Your dashboard content */}
        </div>
      </div>
    ) : (
      <div className="text-center py-8 text-white">User not found. Please log in again.</div>
    )}
  </div>
);