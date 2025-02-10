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
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useToast } from "@/components/ui/useToast";
import { ethers } from "ethers";
import daoManager from "@/utils/abi/daoManager.json";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  daoId: string;
  onMemberInvited: () => void;
}

export default function InviteModal({
  isOpen,
  onClose,
  daoId,
  onMemberInvited,
}: InviteModalProps) {
  const [inviteAddress, setInviteAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInvite = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Error",
        description: "Please install MetaMask to invite members",
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

      const tx = await contract.addMembertoDao(
        daoId,
        inviteAddress,
        await signer.getAddress()
      );
      await tx.wait();

      toast({
        title: "Member Invited",
        description: `${inviteAddress} has been invited to the DAO.`,
      });
      onClose();
      onMemberInvited();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast({
        title: "Error",
        description: "Failed to invite member. Please try again.",
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
          <DialogTitle>Invite Member to DAO</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteAddress">Wallet Address</Label>
            <Input
              id="inviteAddress"
              placeholder="Enter wallet address of the user you want to invite"
              value={inviteAddress}
              onChange={(e) => setInviteAddress(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleInvite}
            disabled={isSubmitting || !inviteAddress}
          >
            {isSubmitting ? "Inviting..." : "Invite Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
