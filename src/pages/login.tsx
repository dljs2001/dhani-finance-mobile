// ... existing imports ...
import logo from "../../public/assets/images/dmi_dhani_logo.png";

// In your JSX
return (
  <div className="min-h-screen bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] flex items-center justify-center p-4">
    <Card className="w-full max-w-md bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20">
      <CardHeader className="space-y-1 text-center">
        <div className="w-full max-w-[320px] mx-auto mb-4">
          <img src={logo} alt="DMI Dhani Logo" className="w-full h-auto" />
        </div>
        {/* ... rest of the login form ... */}