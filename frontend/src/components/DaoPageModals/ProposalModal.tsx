// @ts-nocheck comment
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
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

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  daoId: string;
  onProposalCreated: () => void;
}

export default function ProposalModal({
  isOpen,
  onClose,
  daoId,
  onProposalCreated,
}: ProposalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [votingThreshold, setVotingThreshold] = useState("");
  const [passingThreshold, setPassingThreshold] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [voteOnce, setVoteOnce] = useState("true");
  const [proposalType, setProposalType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
        daoManager,
        signer
      );

      const tx = await contract.createProposal(
        proposalType,
        `${title}|${description}`,
        votingThreshold,
        daoId,
        tokenAddress,
        await signer.getAddress(),
        Math.floor(new Date(startDate).getTime() / 1000),
        Math.floor(new Date(endDate).getTime() / 1000),
        passingThreshold,
        voteOnce === "true"
      );

      await tx.wait();

      toast({
        title: "Proposal Created",
        description: "Your proposal has been created successfully",
      });
      onClose();
      onProposalCreated();
    } catch (error) {
      console.error("Error creating proposal:", error);
      toast({
        title: "Error",
        description: "Failed to create proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    {
      id: "title",
      label: "Proposal Title",
      value: title,
      onChange: setTitle,
      type: "input",
    },
    {
      id: "description",
      label: "Proposal Description",
      value: description,
      onChange: setDescription,
      type: "textarea",
    },
    {
      id: "votingThreshold",
      label: "Voting Threshold",
      value: votingThreshold,
      onChange: setVotingThreshold,
      type: "input",
    },
    {
      id: "passingThreshold",
      label: "Passing Threshold",
      value: passingThreshold,
      onChange: setPassingThreshold,
      type: "input",
    },
    {
      id: "tokenAddress",
      label: "Token Address",
      value: tokenAddress,
      onChange: setTokenAddress,
      type: "input",
    },
    {
      id: "startDate",
      label: "Start Date",
      value: startDate,
      onChange: setStartDate,
      type: "datetime-local",
    },
    {
      id: "endDate",
      label: "End Date",
      value: endDate,
      onChange: setEndDate,
      type: "datetime-local",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-3xl font-bold text-center mb-4">
                Create Proposal
              </DialogTitle>
            </DialogHeader>
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 py-4 overflow-y-auto flex-grow pr-4"
            >
              {formFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor={field.id} className="text-lg font-medium">
                    {field.label}
                  </Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="text-base"
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="text-base"
                    />
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: formFields.length * 0.1 }}
                className="space-y-2"
              >
                <Label className="text-lg font-medium">
                  Allow voting only once
                </Label>
                <RadioGroup
                  value={voteOnce}
                  onValueChange={setVoteOnce}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="yes" />
                    <Label htmlFor="yes" className="text-base">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="no" />
                    <Label htmlFor="no" className="text-base">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: (formFields.length + 1) * 0.1,
                }}
                className="space-y-2"
              >
                <Label htmlFor="proposalType" className="text-lg font-medium">
                  Proposal Type
                </Label>
                <Select value={proposalType} onValueChange={setProposalType}>
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select proposal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" className="text-base">
                      Standard Voting
                    </SelectItem>
                    <SelectItem value="2" className="text-base">
                      Quadratic Voting
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
            <DialogFooter className="flex-shrink-0 mt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full text-lg"
              >
                {isSubmitting ? "Creating..." : "Create Proposal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
