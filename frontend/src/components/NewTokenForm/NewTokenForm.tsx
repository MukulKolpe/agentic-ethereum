// @ts-nocheck comment
"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useToast } from "@/components/ui/useToast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/Progress";
import Form4 from "@/components/ui/Form4";
import Form5 from "@/components/ui/Form5";
import Form6 from "@/components/ui/Form6";
import daomanagerabi from "@/utils/abi/daoManager.json";
import creategovernanceabi from "@/utils/abi/createDaoToken.json";

export default function NewTokenForm() {
  const [progress, setProgress] = useState(33.33);
  const [step, setStep] = useState(1);
  const [mintDone, setMintDone] = useState(false);
  const [thresholdToken, setThresholdToken] = useState<number>();
  const [proposalToken, setProposalToken] = useState<number>();
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [daoVisibility, setDaoVisibility] = useState(false);
  const { toast } = useToast();

  const mintToken = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const createTokenContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CREATE_GOVERNANACE_ADDRESS!,
          creategovernanceabi,
          signer
        );
        const userSideContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
          daomanagerabi,
          signer
        );
        const accounts = await provider.listAccounts();
        const userId = await userSideContract.userWallettoUserId(accounts[0]);

        const tx = await createTokenContract.deployToken(
          tokenName,
          symbol,
          tokenSupply,
          userId
        );
        await tx.wait();
        const totalTokens = await createTokenContract.getTotalTokesnDeployed(
          userId
        );
        const mintedTokenAddress =
          await createTokenContract.userIdtoDeployedTokens(
            userId,
            totalTokens - 1
          );

        setTokenAddress(mintedTokenAddress);
        toast({
          title: "Tokens Minted",
          description: `Token Address: ${mintedTokenAddress}`,
        });
        setMintDone(true);
      } catch (error) {
        console.error("Error minting token:", error);
        toast({
          title: "Error",
          description: "An error occurred while minting the token",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please install MetaMask to mint tokens",
        variant: "destructive",
      });
    }
  };

  const createDAO = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
          daomanagerabi,
          signer
        );
        const accounts = await provider.listAccounts();

        const tx = await contract.createDao(
          name,
          desc,
          thresholdToken,
          proposalToken,
          tokenAddress,
          daoVisibility,
          accounts[0],
          2,
          {
            gasLimit: 1000000,
          }
        );

        await tx.wait(1);

        toast({
          title: "DAO Created",
          description:
            "DAO created successfully. You can view it on explore page",
        });
      } catch (error) {
        console.error("Error creating DAO:", error);
        toast({
          title: "Error",
          description: "An error occurred while creating the DAO",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please install MetaMask to create a DAO",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6 bg-card text-card-foreground shadow-lg rounded-lg">
      <Progress value={progress} className="w-full" />
      {step === 1 ? (
        <Form4
          getTokenSymbol={setSymbol}
          getTokenName={setTokenName}
          getTokenSupply={setTokenSupply}
        />
      ) : step === 2 ? (
        <Form5 getName={setName} getSummary={setDesc} />
      ) : (
        <Form6
          getJoiningThreshold={setThresholdToken}
          getProposal={setProposalToken}
          getVisibility={setDaoVisibility}
        />
      )}
      <div className="flex justify-between">
        <div className="space-x-2">
          {step === 1 ? (
            <Button onClick={mintToken} disabled={mintDone}>
              Mint
            </Button>
          ) : (
            <Button
              onClick={() => {
                setStep(step - 1);
                setProgress(progress - 33.33);
              }}
              disabled={step === 1}
            >
              Back
            </Button>
          )}
          <Button
            onClick={() => {
              setStep(step + 1);
              setProgress(progress + 33.33);
            }}
            disabled={step === 3 || (step === 1 && !mintDone)}
          >
            Next
          </Button>
        </div>
        {step === 3 && (
          <Button onClick={createDAO} variant="destructive">
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
