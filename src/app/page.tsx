"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Wallet, Eye, Lock } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const onboardingSteps = [
    {
      title: "Welcome to Web3 Wallet",
      description: "Your secure gateway to Ethereum and Solana networks",
      icon: <Wallet className="h-12 w-12 text-primary" />,
      content: "Experience the future of decentralized finance with our easy-to-use wallet that supports multiple blockchain networks."
    },
    {
      title: "Security First",
      description: "Your private keys, your control",
      icon: <Shield className="h-12 w-12 text-primary" />,
      content: "We never store your private keys. All cryptographic operations happen locally on your device for maximum security."
    },
    {
      title: "Real-time Monitoring",
      description: "Stay updated with blockchain activity",
      icon: <Eye className="h-12 w-12 text-primary" />,
      content: "Monitor live transaction counts and network activity across Ethereum and Solana networks in real-time."
    },
    {
      title: "Privacy & Control",
      description: "Complete ownership of your assets",
      icon: <Lock className="h-12 w-12 text-primary" />,
      content: "You maintain full control over your wallet and assets. No third parties, no compromises on your privacy."
    }
  ];

  const currentStep = onboardingSteps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {currentStep.icon}
          </div>
          <CardTitle className="text-2xl font-bold">{currentStep.title}</CardTitle>
          <CardDescription className="text-lg">{currentStep.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">{currentStep.content}</p>
          
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <Badge 
                key={index} 
                variant={index === step ? "default" : "secondary"}
                className="w-2 h-2 rounded-full p-0"
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {step > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            
            <Button 
              onClick={() => {
                if (step < onboardingSteps.length - 1) {
                  setStep(step + 1);
                } else {
                  router.push("/wallet");
                }
              }}
              className="flex-1"
            >
              {step === onboardingSteps.length - 1 ? "Create Wallet" : "Next"}
            </Button>
          </div>
          
          {step === onboardingSteps.length - 1 && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Already have a wallet?</p>
              <Button 
                variant="outline" 
                onClick={() => router.push("/wallet?action=login")}
                className="w-full"
              >
                Access Existing Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
