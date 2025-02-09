// @ts-nocheck comment
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/useToast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";
import daomanager from "@/utils/abi/daoManager.json";

interface DaosCardProps {
  daoName: string;
  tokenName: string;
  joiningThreshold: ethers.BigNumber;
  tokenSymbol: string;
  creatorName: string;
  totalDaoMember: number;
  daoId: number;
}

export default function DaosCard({
  daoName,
  tokenName,
  joiningThreshold,
  tokenSymbol,
  creatorName,
  totalDaoMember,
  daoId,
}: DaosCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);

  const joinDao = async () => {
    if (typeof window.ethereum !== "undefined") {
      setIsJoining(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
          daomanager,
          signer
        );
        const accounts = await provider.listAccounts();
        const tx = await contract.joinDao(daoId, accounts[0]);
        await tx.wait();

        toast({
          title: "Congratulations!",
          description: "You have successfully joined the DAO",
        });
      } catch (error) {
        console.error("Error joining DAO:", error);
        toast({
          title: "Error",
          description: "Failed to join the DAO. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsJoining(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please install MetaMask to join DAOs",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative h-60 flex justify-center">
          <Image
            src="/assets/dao.png"
            alt="DAO Cover"
            objectFit="cover"
            className="rounded-t-lg"
            width={280}
            height={240}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <CardTitle className="text-2xl font-bold text-center">
          {daoName}
        </CardTitle>
        <p className="text-center text-muted-foreground text-lg">
          Minimum Tokens Required: {ethers.utils.formatEther(joiningThreshold)}{" "}
          {tokenSymbol}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icons.token className="w-6 h-6 text-primary" />
            <p className="text-lg font-medium">{tokenName}</p>
          </div>
          <p className="text-lg font-medium">{tokenSymbol}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Icons.users className="w-6 h-6 text-primary" />
            <p className="text-lg">{totalDaoMember} members</p>
          </div>
          <div className="flex items-center space-x-2">
            <Icons.admin className="w-6 h-6 text-primary" />
            <p className="text-lg">{creatorName}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-6">
        <Button
          className="w-full text-lg transition-all duration-300 hover:bg-primary-dark"
          onClick={joinDao}
          disabled={isJoining}
        >
          {isJoining ? (
            <>
              <Icons.spinner className="mr-2 h-5 w-5 animate-spin" /> Joining...
            </>
          ) : (
            <>
              <Icons.plus className="mr-2 h-5 w-5" /> Join DAO
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full text-lg transition-all duration-300 hover:bg-secondary"
          onClick={() => router.push(`/dao/${daoId}`)}
        >
          View More <Icons.externalLink className="ml-2 h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}
