"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Copy, Eye, EyeOff, RefreshCw, Wallet, Activity, ArrowLeft, Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { ethers } from "ethers";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import CryptoJS from "crypto-js";

interface WalletData {
  id: string;
  name: string;
  createdAt: string;
  eth: {
    address: string;
    privateKey: string;
    mnemonic: string;
  };
  sol: {
    address: string;
    privateKey: string;
  };
}

interface WalletStorage {
  wallets: WalletData[];
  activeWalletId: string | null;
}


export default function WalletPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isLogin = searchParams.get('action') === 'login';
  
  const [step, setStep] = useState(isLogin ? -1 : 0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [walletStorage, setWalletStorage] = useState<WalletStorage | null>(null);
  const [activeWallet, setActiveWallet] = useState<WalletData | null>(null);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [newWalletName, setNewWalletName] = useState("");
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [solanaBalance, setSolanaBalance] = useState<number>(0);
  const [solanaConnection] = useState(new Connection("https://solana-mainnet.g.alchemy.com/v2/QKrrureycUIjj07NPimML-wuEK_EvVkk"));

  const steps = [
    "Create Secure Password",
    "Generate Wallet",
    "Backup Seed Phrase",
    "Wallet Dashboard"
  ];

  useEffect(() => {
    // Check for existing wallets on mount
    const existingStorage = localStorage.getItem("web3_wallets");
    if (existingStorage) {
      // Wallet exists, user can login
    }
  }, []);

  const saveWalletStorage = (storage: WalletStorage) => {
    try {
      // Create a clean copy of the storage object to avoid circular references
      const cleanStorage: WalletStorage = {
        wallets: storage.wallets.map(wallet => ({
          id: wallet.id,
          name: wallet.name,
          createdAt: wallet.createdAt,
          eth: {
            address: wallet.eth.address,
            privateKey: wallet.eth.privateKey,
            mnemonic: wallet.eth.mnemonic
          },
          sol: {
            address: wallet.sol.address,
            privateKey: wallet.sol.privateKey
          }
        })),
        activeWalletId: storage.activeWalletId
      };
      
      const encryptedStorage = CryptoJS.AES.encrypt(JSON.stringify(cleanStorage), password).toString();
      localStorage.setItem("web3_wallets", encryptedStorage);
      setWalletStorage(cleanStorage);
    } catch (error) {
      console.error("Error saving wallet storage:", error);
    }
  };

  const loginWithPassword = async () => {
    setIsLoading(true);
    setLoginError("");
    
    try {
      // Try new multi-wallet format first
      const encryptedStorage = localStorage.getItem("web3_wallets");
      let storage: WalletStorage;
      
      if (encryptedStorage) {
        // New format
        const decryptedStorage = CryptoJS.AES.decrypt(encryptedStorage, password).toString(CryptoJS.enc.Utf8);
        if (!decryptedStorage) {
          setLoginError("Invalid password. Please try again.");
          return;
        }
        storage = JSON.parse(decryptedStorage);
      } else {
        // Check for old single wallet format
        const oldEncryptedWallet = localStorage.getItem("web3_wallet");
        if (!oldEncryptedWallet) {
          setLoginError("No wallets found. Please create a new wallet.");
          return;
        }
        
        const decryptedWallet = CryptoJS.AES.decrypt(oldEncryptedWallet, password).toString(CryptoJS.enc.Utf8);
        if (!decryptedWallet) {
          setLoginError("Invalid password. Please try again.");
          return;
        }
        
        // Migrate old format to new format
        const oldWallet = JSON.parse(decryptedWallet);
        const migratedWallet: WalletData = {
          id: Date.now().toString(),
          name: "My Wallet",
          createdAt: new Date().toISOString(),
          ...oldWallet
        };
        
        storage = {
          wallets: [migratedWallet],
          activeWalletId: migratedWallet.id
        };
        
        // Save in new format and remove old
        saveWalletStorage(storage);
        localStorage.removeItem("web3_wallet");
      }
      
      setWalletStorage(storage);
      
      if (storage.activeWalletId && storage.wallets.length > 0) {
        const active = storage.wallets.find(w => w.id === storage.activeWalletId) || storage.wallets[0];
        setActiveWallet(active);
      }
      
      setStep(3);
    } catch {
      setLoginError("Invalid password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateWallet = async (nameOrEvent?: string | React.MouseEvent) => {
    setIsLoading(true);
    try {
      const ethWallet = ethers.Wallet.createRandom();
      const solKeypair = Keypair.generate();
      
      // Determine if the parameter is a name or an event
      const name = typeof nameOrEvent === 'string' ? nameOrEvent : undefined;
      
      // Create clean wallet data object
      const walletData: WalletData = {
        id: Date.now().toString(),
        name: name || "My Wallet",
        createdAt: new Date().toISOString(),
        eth: {
          address: String(ethWallet.address),
          privateKey: String(ethWallet.privateKey),
          mnemonic: String(ethWallet.mnemonic?.phrase || "")
        },
        sol: {
          address: solKeypair.publicKey.toBase58(),
          privateKey: Buffer.from(solKeypair.secretKey).toString('hex')
        }
      };

      const storage: WalletStorage = {
        wallets: [walletData],
        activeWalletId: walletData.id
      };

      saveWalletStorage(storage);
      setActiveWallet(walletData);
      setStep(2);
    } catch (error) {
      console.error("Error generating wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSolanaBalance = useCallback(async (address: string) => {
    try {
      const publicKey = new PublicKey(address);
      const balance = await solanaConnection.getBalance(publicKey);
      return balance / 1000000000; // Convert lamports to SOL
    } catch (error) {
      console.error("Error fetching Solana balance:", error);
      return 0;
    }
  }, [solanaConnection]);


  useEffect(() => {
    // Fetch initial Solana balance when dashboard loads
    if (step === 3 && activeWallet?.sol?.address) {
      fetchSolanaBalance(activeWallet.sol.address).then(setSolanaBalance).catch(() => setSolanaBalance(0));
    }
  }, [step, activeWallet, fetchSolanaBalance]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const addNewWallet = async () => {
    if (!walletStorage || !newWalletName.trim()) return;
    
    setIsLoading(true);
    try {
      const ethWallet = ethers.Wallet.createRandom();
      const solKeypair = Keypair.generate();
      
      // Create clean wallet data object
      const newWalletData: WalletData = {
        id: Date.now().toString(),
        name: String(newWalletName.trim()),
        createdAt: new Date().toISOString(),
        eth: {
          address: String(ethWallet.address),
          privateKey: String(ethWallet.privateKey),
          mnemonic: String(ethWallet.mnemonic?.phrase || "")
        },
        sol: {
          address: solKeypair.publicKey.toBase58(),
          privateKey: Buffer.from(solKeypair.secretKey).toString('hex')
        }
      };

      const updatedStorage: WalletStorage = {
        wallets: [...walletStorage.wallets, newWalletData],
        activeWalletId: newWalletData.id
      };

      saveWalletStorage(updatedStorage);
      setActiveWallet(newWalletData);
      setNewWalletName("");
    } catch (error) {
      console.error("Error generating new wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchWallet = (walletId: string) => {
    if (!walletStorage) return;
    
    const wallet = walletStorage.wallets.find(w => w.id === walletId);
    if (wallet) {
      setActiveWallet(wallet);
      const updatedStorage: WalletStorage = {
        ...walletStorage,
        activeWalletId: walletId
      };
      saveWalletStorage(updatedStorage);
    }
  };

  const deleteWallet = (walletId: string) => {
    if (!walletStorage || walletStorage.wallets.length <= 1) return;
    
    const updatedWallets = walletStorage.wallets.filter(w => w.id !== walletId);
    const newActiveId = walletId === walletStorage.activeWalletId 
      ? updatedWallets[0]?.id || null 
      : walletStorage.activeWalletId;
    
    const updatedStorage: WalletStorage = {
      wallets: updatedWallets,
      activeWalletId: newActiveId
    };
    
    saveWalletStorage(updatedStorage);
    
    if (newActiveId) {
      const newActiveWallet = updatedWallets.find(w => w.id === newActiveId);
      setActiveWallet(newActiveWallet || null);
    }
  };

  const renameWallet = (walletId: string, newName: string) => {
    if (!walletStorage || !newName.trim()) return;
    
    const updatedWallets = walletStorage.wallets.map(w => 
      w.id === walletId ? { ...w, name: newName.trim() } : w
    );
    
    const updatedStorage: WalletStorage = {
      ...walletStorage,
      wallets: updatedWallets
    };
    
    saveWalletStorage(updatedStorage);
    
    if (activeWallet?.id === walletId) {
      setActiveWallet({ ...activeWallet, name: newName.trim() });
    }
    
    setEditingWalletId(null);
    setEditingName("");
  };

  const renderLoginStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Access Your Wallet</CardTitle>
            <CardDescription>Enter your password to unlock your wallet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loginPassword">Password</Label>
          <Input
            id="loginPassword"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your wallet password"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                loginWithPassword();
              }
            }}
          />
        </div>
        {loginError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Button
            onClick={loginWithPassword}
            disabled={!password || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Unlocking...
              </>
            ) : (
              "Unlock Wallet"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/wallet")}
            className="w-full"
          >
            Create New Wallet Instead
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPasswordStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create Secure Password</CardTitle>
        <CardDescription>This password will encrypt your wallet locally</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter a strong password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Choose a strong password. You&apos;ll need it to access your wallet.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => setStep(1)}
          disabled={!password || password !== confirmPassword || password.length < 8}
          className="w-full"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );

  const renderGenerateStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Generate Wallet</CardTitle>
        <CardDescription>Create your multi-chain wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-4">
          <Wallet className="h-16 w-16 mx-auto text-primary" />
          <p className="text-muted-foreground">
            Click below to generate your secure wallet with support for Ethereum and Solana networks.
          </p>
        </div>
        <Button onClick={generateWallet} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Wallet"
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderBackupStep = () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Backup Seed Phrase</CardTitle>
        <CardDescription>Write down your recovery phrase for &ldquo;{activeWallet?.name}&rdquo;</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Store this seed phrase safely. It&apos;s the only way to recover your wallet.
          </AlertDescription>
        </Alert>
        <Textarea
          value={activeWallet?.eth.mnemonic}
          readOnly
          className="min-h-[100px] font-mono text-sm"
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              const mnemonicToCopy = activeWallet?.eth.mnemonic || "";
              copyToClipboard(mnemonicToCopy);
            }}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button onClick={() => setStep(3)} className="flex-1">
            I&apos;ve Saved It
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDashboard = () => (
    <div className="w-full max-w-6xl space-y-6">
      {/* Wallet Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Wallet className="h-5 w-5 mr-2" />
              My Wallets ({walletStorage?.wallets.length || 0})
            </span>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {walletStorage?.wallets.map((wallet) => (
              <Card 
                key={wallet.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeWallet?.id === wallet.id 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  const walletIdToSwitch = wallet.id;
                  switchWallet(walletIdToSwitch);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {editingWalletId === wallet.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-8 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                renameWallet(wallet.id, editingName);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              const walletIdToRename = wallet.id;
                              const newName = editingName;
                              renameWallet(walletIdToRename, newName);
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingWalletId(null);
                              setEditingName("");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-sm">{wallet.name}</h3>
                          {activeWallet?.id === wallet.id && (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {new Date(wallet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          const walletIdToEdit = wallet.id;
                          const currentName = wallet.name;
                          setEditingWalletId(walletIdToEdit);
                          setEditingName(currentName);
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      {walletStorage?.wallets.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            const walletIdToDelete = wallet.id;
                            deleteWallet(walletIdToDelete);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">ETH</span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {wallet.eth.address.slice(0, 8)}...{wallet.eth.address.slice(-6)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">SOL</span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {wallet.sol.address.slice(0, 8)}...{wallet.sol.address.slice(-6)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Wallet Card */}
            <Card className="cursor-pointer border-dashed border-2 hover:bg-muted/50 transition-colors">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[120px]">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-3">Add New Wallet</p>
                <div className="w-full space-y-2">
                  <Input
                    placeholder="Wallet name"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    className="h-8 text-sm"
                  />
                  <Button
                    onClick={() => {
                      addNewWallet();
                    }}
                    disabled={!newWalletName.trim() || isLoading}
                    size="sm"
                    className="w-full"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    Create
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Active Wallet Details */}
      {activeWallet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              {activeWallet.name} - Wallet Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="ethereum">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="solana">Solana</TabsTrigger>
              </TabsList>
              <TabsContent value="ethereum" className="space-y-4">
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex space-x-2">
                    <Input value={activeWallet.eth.address} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const addressToCopy = activeWallet.eth.address;
                        copyToClipboard(addressToCopy);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Private Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      type={showPrivateKeys ? "text" : "password"}
                      value={activeWallet.eth.privateKey}
                      readOnly
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newVisibility = !showPrivateKeys;
                        setShowPrivateKeys(newVisibility);
                      }}
                    >
                      {showPrivateKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="solana" className="space-y-4">
                <div className="space-y-2">
                  <Label>Address</Label>
                  <div className="flex space-x-2">
                    <Input value={activeWallet.sol.address} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const solAddressToCopy = activeWallet.sol.address;
                        copyToClipboard(solAddressToCopy);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Balance</Label>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-lg font-mono">
                      {solanaBalance.toFixed(6)} SOL
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (activeWallet?.sol?.address) {
                          fetchSolanaBalance(activeWallet.sol.address).then(setSolanaBalance);
                        }
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {step < 3 && (
          <div className="mb-8">
            <div className="flex justify-center space-x-2 mb-4">
              {steps.map((stepName, index) => (
                <Badge
                  key={index}
                  variant={index <= step ? "default" : "secondary"}
                  className="px-3 py-1"
                >
                  {index + 1}. {stepName}
                </Badge>
              ))}
            </div>
            <Progress value={(step / (steps.length - 1)) * 100} className="w-full" />
          </div>
        )}

        <div className="flex justify-center">
          {step === -1 && renderLoginStep()}
          {step === 0 && renderPasswordStep()}
          {step === 1 && renderGenerateStep()}
          {step === 2 && renderBackupStep()}
          {step === 3 && renderDashboard()}
        </div>
      </div>
    </div>
  );
}