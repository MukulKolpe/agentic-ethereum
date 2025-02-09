"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/useToast";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Spinner } from "@/components/Spinner";

interface Form3Props {
  getTokenAddress: (address: string) => void;
}

export default function Form3({ getTokenAddress }: Form3Props) {
  const { toast } = useToast();
  const [tokenDetails, setTokenDetails] = useState({ symbol: "", name: "" });
  const [loading, setLoading] = useState(false);

  const handleAddress = async (address: string) => {
    if (address.trim()) {
      setLoading(true);
      try {
        const { symbol, name } = await fetchTokenDetails(address);
        setTokenDetails({ symbol, name });
      } catch (error) {
        console.error("Error fetching token details:", error);
        toast({
          title: "Error",
          description: "Unable to fetch token details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Token Address Not Entered correctly",
        variant: "destructive",
      });
    }
    getTokenAddress(address);
  };

  const fetchTokenDetails = async (address: string) => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );
    const contract = new ethers.Contract(
      address,
      [
        "function symbol() view returns (string)",
        "function name() view returns (string)",
      ],
      provider
    );
    const symbol = await contract.symbol();
    const name = await contract.name();
    return { symbol, name };
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Token Details</h2>
      <div className="space-y-2">
        <Label htmlFor="tokenAddress">Token Address</Label>
        <Input
          id="tokenAddress"
          placeholder="Enter Token Address"
          onChange={(e) => handleAddress(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenSymbol">Token Symbol</Label>
        <div className="relative">
          <Input
            id="tokenSymbol"
            placeholder="Token Symbol"
            value={loading ? "Loading..." : tokenDetails.symbol}
            readOnly
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tokenName">Token Name</Label>
        <div className="relative">
          <Input
            id="tokenName"
            placeholder="Token Name"
            value={loading ? "Loading..." : tokenDetails.name}
            readOnly
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
