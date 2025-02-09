"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/useToast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/Progress";
import { ethers } from "ethers";
import Form1 from "@/components/ui/Form1";
import Form2 from "@/components/ui/Form2";
import Form3 from "@/components/ui/Form3";
import daomanagerabi from "@/utils/abi/daoManager.json";

export default function ExistingTokenForm() {
  const { toast } = useToast();
  const [progress, setProgress] = useState(33.33);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [thresholdToken, setThresholdToken] = useState<number>();
  const [proposalToken, setProposalToken] = useState<number>();
  const [tokenAddress, setTokenAddress] = useState("");
  const [daoVisibility, setDaoVisibility] = useState(false);

  const createDAO = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log("Creating DAO");

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
          1,
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
        <Form1 getName={setName} getSummary={setDesc} />
      ) : step === 2 ? (
        <Form2
          getJoiningThreshold={setThresholdToken}
          getProposal={setProposalToken}
          getVisibility={setDaoVisibility}
        />
      ) : (
        <Form3 getTokenAddress={setTokenAddress} />
      )}
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button
            onClick={() => {
              setStep(step - 1);
              setProgress(progress - 33.33);
            }}
            disabled={step === 1}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              setStep(step + 1);
              setProgress(progress + 33.33);
            }}
            disabled={step === 3}
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
