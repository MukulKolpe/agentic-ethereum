// @ts-nocheck comment
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/button";

interface ProposalTabProps {
  proposalArray: any[];
  isMember: boolean;
  daoId: string;
  onVote: (proposal: any) => void;
  onViewResults: (proposalId: string) => void;
}

export default function ProposalTab({
  proposalArray,
  isMember,
  daoId,
  onVote,
  onViewResults,
}: ProposalTabProps) {
  const [currentTimestamp] = useState(Math.floor(Date.now() / 1000));

  const filterProposals = (status: "ongoing" | "upcoming" | "past") => {
    return proposalArray.filter((proposal) => {
      const beginningTime = Number(proposal.proposalInfo.beginningTime);
      const endingTime = Number(proposal.proposalInfo.endingTime);
      if (status === "ongoing") {
        return (
          currentTimestamp >= beginningTime && currentTimestamp <= endingTime
        );
      } else if (status === "upcoming") {
        return currentTimestamp < beginningTime;
      } else {
        return currentTimestamp > endingTime;
      }
    });
  };

  const renderProposalCard = (
    proposal: any,
    status: "ongoing" | "upcoming" | "past"
  ) => {
    const title = proposal.proposalInfo[2].substring(
      0,
      proposal.proposalInfo[2].indexOf("|")
    );
    const description = proposal.proposalInfo[2].substring(
      proposal.proposalInfo[2].indexOf("|") + 1
    );
    const beginningTime = Number(proposal.proposalInfo.beginningTime);
    const endingTime = Number(proposal.proposalInfo.endingTime);

    return (
      <Card key={proposal.proposalInfo.proposalId} className="mb-4">
        <CardHeader className="text-center">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p>{description}</p>
          {status === "ongoing" && (
            <p className="mt-2">
              ⏳ {Math.floor((endingTime - currentTimestamp) / 3600)} hours
              remaining
            </p>
          )}
          {status === "upcoming" && (
            <p className="mt-2">
              🕒 Starts in{" "}
              {Math.floor((beginningTime - currentTimestamp) / 3600)} hours
            </p>
          )}
          {status === "past" && (
            <p className="mt-2">
              ✅ Ended {Math.floor((currentTimestamp - endingTime) / 3600)}{" "}
              hours ago
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {status === "ongoing" && isMember && (
            <Button onClick={() => onVote(proposal)}>Vote Now</Button>
          )}
          {status === "past" && (
            <Button
              onClick={() => onViewResults(proposal.proposalInfo.proposalId)}
            >
              View Results
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing">
          {filterProposals("ongoing").map((proposal) =>
            renderProposalCard(proposal, "ongoing")
          )}
        </TabsContent>
        <TabsContent value="upcoming">
          {filterProposals("upcoming").map((proposal) =>
            renderProposalCard(proposal, "upcoming")
          )}
        </TabsContent>
        <TabsContent value="past">
          {filterProposals("past").map((proposal) =>
            renderProposalCard(proposal, "past")
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
