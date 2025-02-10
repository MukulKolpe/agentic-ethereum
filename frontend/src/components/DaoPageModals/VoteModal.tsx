"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useToast } from "@/components/ui/useToast";
import { ethers } from "ethers";
import daoManager from "@/utils/abi/daoManager.json";

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: number;
  daoId: string;
}

export default function VoteModal({
  isOpen,
  onClose,
  proposalId,
  daoId,
}: VoteModalProps) {
  const [userResponse, setUserResponse] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleVote = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Error",
        description: "Please install MetaMask to vote",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
        daoManager,
        signer
      );

      // First, authorize the contract to spend tokens
      const authorizeTx = await contract.authorizeVoting(proposalId);
      await authorizeTx.wait();

      // Then, cast the vote
      const voteTx = await contract.voteForProposal(
        proposalId,
        Number.parseInt(userResponse),
        await signer.getAddress()
      );
      await voteTx.wait();

      toast({
        title: "Vote Cast",
        description: "Your vote has been successfully recorded",
      });
      onClose();
    } catch (error) {
      console.error("Error casting vote:", error);
      toast({
        title: "Error",
        description: "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cast Your Vote</DialogTitle>
        </DialogHeader>
        <Select value={userResponse} onValueChange={setUserResponse}>
          <SelectTrigger>
            <SelectValue placeholder="Select your vote" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Yes</SelectItem>
            <SelectItem value="2">No</SelectItem>
            <SelectItem value="3">Abstain</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-2">
          Please authorize first and wait for the transaction to end. Then press
          Submit to cast your vote.
        </p>
        <DialogFooter>
          <Button onClick={handleVote} disabled={isSubmitting || !userResponse}>
            {isSubmitting ? "Submitting..." : "Authorize & Vote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
