
export interface User {
  id: string;
  userId: string;
  password: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  availableBalance: number;
  bankName: string;
  withdrawAccountNumber: string;
  withdrawalFee: number;
  initialDeposit: number;
  createdAt?: any; // For Firestore timestamps
  lastLogin?: any; // For Firestore timestamps
}

export interface AdminCredentials {
  userId: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => void;
}
