
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
      description: (
        <div className="font-['Anton'] text-base">
          Please pay <span className="font-bold text-white bg-red-600 px-2 py-1 rounded">₹{user?.withdrawalFee || 1400}</span> to withdraw this amount from your Dhani Account to your Savings Account. The given payment will be refunded within 20 (twenty) minutes via the same mode of payment used.
          <div className="mt-4 flex gap-3">
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              Pay Now
            </Button>
            <Button variant="secondary" onClick={() => toast.dismiss()}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      variant: "default",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4 mb-8 bg-[#24243e]/50 p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <img 
              src="/assets/images/dmi_dhani_logo.png" 
              alt="Dhani Finance DMI" 
              className="h-8 sm:h-10" 
            />
            <Button 
              onClick={logout}
              className="bg-purple-600 hover:bg-purple-700 text-white border-none text-sm px-4"
            >
              Logout
            </Button>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg sm:text-2xl font-bold text-white animate-scroll bg-purple-600 px-3 py-1 rounded-full inline-block">
              Welcome, {user.accountName}
            </h1>
          </div>
        </div>
        <Card className="bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20 p-6">
          {/* Account details card */}
          <Card className="p-6 mb-6 bg-[#24243e]/50 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <h2 className="text-xl font-semibold mb-4 bg-purple-600 text-white px-3 py-1 rounded-lg inline-block">Account Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Account Name</span>
                <span className="font-medium text-white bg-purple-600 px-3 py-1 rounded-full">{user.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Account Number</span>
                <span className="font-medium text-white bg-purple-600 px-3 py-1 rounded-full">{user.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Account Type</span>
                <span className="font-medium text-white bg-purple-600 px-3 py-1 rounded-full">{user.accountType}</span>
              </div>
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Available Balance</span>
                <span className="font-bold text-[#006E33] bg-white px-3 py-1 rounded-full">₹ {user.availableBalance.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Withdraw section */}
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-6 whitespace-normal break-words min-h-[60px] px-3 py-2"
            onClick={handleWithdraw}
          >
            <span className="block text-sm">
              Withdraw to your Account of: {user.bankName}: XXXX XXXX {user.withdrawAccountNumber}
            </span>
          </Button>

          {/* Transaction details */}
          <Card className="p-6 bg-[#24243e]/50 border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            <h2 className="text-xl font-semibold mb-4 bg-purple-600 text-white px-3 py-1 rounded-lg inline-block">Transaction Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Transfer to Saving Account</span>
                <span className="font-medium text-[#FF1414] bg-white px-3 py-1 rounded-full">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Initial Deposit</span>
                <span className="font-bold text-[#006E33] bg-white px-3 py-1 rounded-full">+ ₹ {user.initialDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">Loan Amount Paid</span>
                <span className="font-medium text-[#FF1414] bg-white px-3 py-1 rounded-full">₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full">ATM Withdrawal</span>
                <span className="font-medium text-[#FF1414] bg-white px-3 py-1 rounded-full">₹ 0.00</span>
              </div>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default User;
