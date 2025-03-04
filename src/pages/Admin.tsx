
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import logo from "../../public/assets/images/dmi_dhani_logo.png";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    userId: "",
    password: "",
    accountName: "",
    accountNumber: "",
    accountType: "Loan Account",
    availableBalance: 500000,
    bankName: "RBL Bank",
    withdrawAccountNumber: "1234",
    withdrawalFee: 1400,
    initialDeposit: 500000
  });

  useEffect(() => {
    if (!isAdmin) {
      console.log("Not admin, redirecting...");
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
    } else {
      console.log("Is admin, fetching users...");
      fetchUsers();
    }
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from('users')
        .select('*');

      if (error) throw error;
      
      console.log("Raw data from Supabase:", data);
      
      // Map the database columns to our User interface with null checks
      const mappedUsers = (data || []).map(user => ({
        id: user.id || '',
        userId: user.user_id || '',
        password: user.password || '',
        accountName: user.account_name || '',
        accountNumber: user.account_number || '',
        accountType: user.account_type || 'Loan Account',
        availableBalance: Number(user.available_balance) || 0,
        bankName: user.bank_name || 'RBL Bank',
        withdrawAccountNumber: user.withdraw_account_number || '',
        withdrawalFee: Number(user.withdrawal_fee) || 0,
        initialDeposit: Number(user.initial_deposit) || 0
      }));

      console.log("Mapped users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      console.log("Creating new user with data:", newUser);
      
      if (!newUser.userId || !newUser.password || !newUser.accountName || !newUser.accountNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', newUser.userId)
        .single();

      if (existingUser) {
        toast({
          title: "Error",
          description: "A user with this User ID already exists.",
          variant: "destructive",
        });
        return;
      }

      const userData = {
        user_id: newUser.userId,
        password: newUser.password,
        account_name: newUser.accountName,
        account_number: newUser.accountNumber,
        account_type: newUser.accountType || 'Loan Account',
        available_balance: Number(newUser.availableBalance) || 500000,
        bank_name: newUser.bankName || 'RBL Bank',
        withdraw_account_number: newUser.withdrawAccountNumber || '1234',
        withdrawal_fee: Number(newUser.withdrawalFee) || 1400,
        initial_deposit: Number(newUser.initialDeposit) || 500000
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Postgres unique constraint violation
          toast({
            title: "Error",
            description: "A user with this User ID already exists.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "User created successfully.",
      });
      
      setNewUser({
        userId: "",
        password: "",
        accountName: "",
        accountNumber: "",
        accountType: "Loan Account",
        availableBalance: 500000,
        bankName: "RBL Bank",
        withdrawAccountNumber: "1234",
        withdrawalFee: 1400,
        initialDeposit: 500000
      });
      
      await fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user.",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const { id, ...userData } = editingUser;
      const { error } = await supabase
        .from('users')
        .update({
          user_id: userData.userId,
          password: userData.password,
          account_name: userData.accountName,
          account_number: userData.accountNumber,
          account_type: userData.accountType,
          available_balance: Number(userData.availableBalance),
          bank_name: userData.bankName,
          withdraw_account_number: userData.withdrawAccountNumber,
          withdrawal_fee: Number(userData.withdrawalFee),
          initial_deposit: Number(userData.initialDeposit)
        })
        .eq('id', id);

      if (error) {
        console.error("Update error:", error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
      setEditingUser(null);
      await fetchUsers(); // Refresh the list after update
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#0f0c29,_#302b63,_#24243e)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-[#24243e]/50 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <img 
              src="/assets/images/dmi_dhani_logo.png" 
              alt="Dhani Finance DMI" 
              className="h-10 mr-3" 
            />
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <Button 
            onClick={logout}
            className="bg-purple-600 hover:bg-purple-700 text-white border-none"
          >
            Logout
          </Button>
        </div>

        {/* Create User Section */}
        <Card className="p-6 mb-8 bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">Create New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userId" className="text-white">User ID</Label>
              <Input 
                id="userId" 
                value={newUser.userId} 
                onChange={(e) => setNewUser({...newUser, userId: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={newUser.password} 
                onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="accountName" className="text-white">Account Name</Label>
              <Input 
                id="accountName" 
                value={newUser.accountName} 
                onChange={(e) => setNewUser({...newUser, accountName: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="accountNumber" className="text-white">Account Number</Label>
              <Input 
                id="accountNumber" 
                value={newUser.accountNumber} 
                onChange={(e) => setNewUser({...newUser, accountNumber: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="accountType" className="text-white">Account Type</Label>
              <Input 
                id="accountType" 
                value={newUser.accountType} 
                onChange={(e) => setNewUser({...newUser, accountType: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="availableBalance" className="text-white">Available Balance</Label>
              <Input 
                id="availableBalance" 
                type="number" 
                value={newUser.availableBalance.toString()} 
                onChange={(e) => setNewUser({...newUser, availableBalance: Number(e.target.value)})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="bankName" className="text-white">Bank Name</Label>
              <Input 
                id="bankName" 
                value={newUser.bankName} 
                onChange={(e) => setNewUser({...newUser, bankName: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="withdrawAccountNumber" className="text-white">Withdraw Account Number</Label>
              <Input 
                id="withdrawAccountNumber" 
                value={newUser.withdrawAccountNumber} 
                onChange={(e) => setNewUser({...newUser, withdrawAccountNumber: e.target.value})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="withdrawalFee" className="text-white">Withdrawal Fee</Label>
              <Input 
                id="withdrawalFee" 
                type="number" 
                value={newUser.withdrawalFee.toString()} 
                onChange={(e) => setNewUser({...newUser, withdrawalFee: Number(e.target.value)})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
            <div>
              <Label htmlFor="initialDeposit" className="text-white">Initial Deposit</Label>
              <Input 
                id="initialDeposit" 
                type="number" 
                value={newUser.initialDeposit.toString()} 
                onChange={(e) => setNewUser({...newUser, initialDeposit: Number(e.target.value)})} 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <Button 
            onClick={handleCreateUser} 
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Create User
          </Button>
        </Card>

        {/* User List Section */}
        <Card className="p-6 bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20">
          <h2 className="text-xl font-semibold mb-4 text-white">User Management</h2>
          
          {loading ? (
            <div className="text-center py-8 text-white">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-white">No users found. Create a new user to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left p-2 text-white">User ID</th>
                    <th className="text-left p-2 text-white">Account Name</th>
                    <th className="text-left p-2 text-white">Account Number</th>
                    <th className="text-left p-2 text-white">Balance</th>
                    <th className="text-left p-2 text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-white/20 hover:bg-white/5">
                      <td className="p-2 text-white">{user.userId}</td>
                      <td className="p-2 text-white">{user.accountName}</td>
                      <td className="p-2 text-white">{user.accountNumber}</td>
                      <td className="p-2 text-white">₹ {user.availableBalance.toLocaleString()}</td>
                      <td className="p-2 flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-500 hover:bg-blue-600 text-white border-none"
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Edit User Modal with updated styling */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-[linear-gradient(to_bottom,_#24243e,_#302b63,_#0f0c29)] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-white">Edit User</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-userId" className="text-white">User ID</Label>
                  <Input 
                    id="edit-userId" 
                    value={editingUser.userId} 
                    onChange={(e) => setEditingUser({...editingUser, userId: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-password" className="text-white">Password</Label>
                  <Input 
                    id="edit-password" 
                    type="password" 
                    value={editingUser.password} 
                    onChange={(e) => setEditingUser({...editingUser, password: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-accountName" className="text-white">Account Name</Label>
                  <Input 
                    id="edit-accountName" 
                    value={editingUser.accountName} 
                    onChange={(e) => setEditingUser({...editingUser, accountName: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-accountNumber" className="text-white">Account Number</Label>
                  <Input 
                    id="edit-accountNumber" 
                    value={editingUser.accountNumber} 
                    onChange={(e) => setEditingUser({...editingUser, accountNumber: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-accountType" className="text-white">Account Type</Label>
                  <Input 
                    id="edit-accountType" 
                    value={editingUser.accountType} 
                    onChange={(e) => setEditingUser({...editingUser, accountType: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-availableBalance" className="text-white">Available Balance</Label>
                  <Input 
                    id="edit-availableBalance" 
                    type="number" 
                    value={editingUser.availableBalance.toString()} 
                    onChange={(e) => setEditingUser({...editingUser, availableBalance: Number(e.target.value)})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-bankName" className="text-white">Bank Name</Label>
                  <Input 
                    id="edit-bankName" 
                    value={editingUser.bankName} 
                    onChange={(e) => setEditingUser({...editingUser, bankName: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-withdrawAccountNumber" className="text-white">Withdraw Account Number</Label>
                  <Input 
                    id="edit-withdrawAccountNumber" 
                    value={editingUser.withdrawAccountNumber} 
                    onChange={(e) => setEditingUser({...editingUser, withdrawAccountNumber: e.target.value})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-withdrawalFee" className="text-white">Withdrawal Fee</Label>
                  <Input 
                    id="edit-withdrawalFee" 
                    type="number" 
                    value={editingUser.withdrawalFee.toString()} 
                    onChange={(e) => setEditingUser({...editingUser, withdrawalFee: Number(e.target.value)})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-initialDeposit" className="text-white">Initial Deposit</Label>
                  <Input 
                    id="edit-initialDeposit" 
                    type="number" 
                    value={editingUser.initialDeposit.toString()} 
                    onChange={(e) => setEditingUser({...editingUser, initialDeposit: Number(e.target.value)})} 
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingUser(null)}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateUser}
                  className="bg-green-800 hover:bg-green-900 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
);
};

export default Admin;
