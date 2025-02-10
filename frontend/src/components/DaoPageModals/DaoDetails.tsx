// @ts-nocheck comment
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users, Wallet, FileText, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";

interface DaoDetailsProps {
  daoInfo: any;
  totalMembers: number;
  adminInfo: any;
  isMember: boolean;
  address: string;
  onAddProposal: () => void;
  onAddMember: () => void;
}

export default function DaoDetails({
  daoInfo,
  totalMembers,
  adminInfo,
  isMember,
  address,
  onAddProposal,
  onAddMember,
}: DaoDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mb-8"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-background to-background/80 shadow-lg border-2 border-primary/20">
        <CardHeader className="text-center relative p-8">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <CardTitle className="text-4xl font-bold text-primary z-10 relative mb-2">
            {daoInfo.daoName}
          </CardTitle>
          <p className="text-xl text-muted-foreground z-10 relative flex items-center justify-center">
            <Hash className="w-5 h-5 mr-2" />
            DAO #{Number(daoInfo.daoId)}
          </p>
        </CardHeader>
        <CardContent className="text-center relative z-10 px-8">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6 py-4">
                  <div className="flex items-center justify-center space-x-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <p className="text-lg">{daoInfo.daoDescription}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Wallet className="w-6 h-6 text-primary" />
                    <p className="text-lg">
                      <strong>Governance Token:</strong>{" "}
                      <span className="font-mono bg-primary/10 px-2 py-1 rounded">
                        {daoInfo.governanceTokenAddress}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <Users className="w-6 h-6 text-primary" />
                    <p className="text-lg">
                      <strong>Total Members:</strong> {totalMembers}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-lg">
                      <strong>Creator:</strong> {adminInfo?.userName}
                    </p>
                    <p className="text-sm text-muted-foreground font-mono bg-primary/10 px-2 py-1 rounded">
                      {adminInfo?.userWallet}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center space-y-4 p-6">
          <div className="flex justify-center space-x-4">
            {isMember && (
              <Button variant="outline" size="lg" onClick={onAddProposal}>
                Add Proposal
              </Button>
            )}
            {adminInfo?.userWallet === address && (
              <Button variant="outline" size="lg" onClick={onAddMember}>
                Add Member
              </Button>
            )}
          </div>
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary hover:text-primary/80 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronDown
              className={`w-8 h-8 transition-transform duration-300 ${
                isExpanded ? "transform rotate-180" : ""
              }`}
            />
          </motion.button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
