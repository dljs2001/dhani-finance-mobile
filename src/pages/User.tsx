
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AuthContextType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

const User = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "Please login to access your account.",
        variant: "destructive",
      });
    }
  }, [user, navigate]);

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Fee",
      description: `Please pay ₹${user?.withdrawalFee || 1400} to withdraw this amount from your Dhani Account to your Savings Account. The given payment will be refunded within 20 (twenty) minutes via the same mode of payment used.`,
      variant: "default",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-[#24243e]/50 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <img 
              src="/assets/images/dmi_dhani_logo.png" 
              alt="Dhani Finance DMI" 
              className="h-10 mr-3" 
            />
            <h1 className="text-2xl font-bold text-white">User Dashboard</h1>
          </div>
          <Button 
            onClick={logout}
            className="bg-purple-600 hover:bg-purple-700 text-white border-none"
          >
            Logout
          </Button>
        </div>

        <Card className="bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20 p-6">
          {/* Account details card */}
          <Card className="p-6 mb-6 bg-[#24243e]/50 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <h2 className="text-xl font-semibold mb-4 text-white">Account Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Account Name</span>
                <span className="font-medium text-white">{user.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Account Number</span>
                <span className="font-medium text-white">{user.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Account Type</span>
                <span className="font-medium text-white">{user.accountType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Available Balance</span>
                <span className="font-medium text-emerald-400">₹ {user.availableBalance.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Withdraw section */}
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-6"
            onClick={handleWithdraw}
          >
            Withdraw to your Account of: {user.bankName}: XXXX XXXX {user.withdrawAccountNumber}
          </Button>

          {/* Transaction details */}
          <Card className="p-6 bg-[#24243e]/50 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <h2 className="text-xl font-semibold mb-4 text-white">Transaction Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Transfer to Saving Account</span>
                <span className="font-medium text-white">₹ 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Initial Deposit</span>
                <span className="font-medium text-emerald-400">+ ₹ {user.initialDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Loan Amount Paid</span>
                <span className="font-medium text-white">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">ATM Withdrawal</span>
                <span className="font-medium text-white">₹ 0.00</span>
              </div>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default User;
