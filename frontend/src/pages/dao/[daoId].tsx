"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useToast } from "@/components/ui/useToast";
import { Spinner } from "@/components/Spinner";
import DaoDetails from "@/components/DaoPageModals/DaoDetails";
import ProposalTab from "@/components/DaoPageModals/ProposalTab";
import ProposalModal from "@/components/DaoPageModals/ProposalModal";
import VoteModal from "@/components/DaoPageModals/VoteModal";
import InviteModal from "@/components/DaoPageModals/InviteModal";
import VoteResults from "@/components/DaoPageModals/VoteResults";
import daoManager from "@/utils/abi/daoManager.json";
import daoToken from "@/utils/abi/daoToken.json";

export default function DaoPage() {
  const params = useParams();
  const daoId = params?.daoId as string;
  const { address } = useAccount();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [daoInfo, setDaoInfo] = useState<any>(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [proposalArray, setProposalArray] = useState([]);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isVoteResultsModalOpen, setIsVoteResultsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [voteResults, setVoteResults] = useState<any>(null);

  useEffect(() => {
    if (daoId) {
      loadDaoInfo();
    }
  }, [daoId]);

  const loadDaoInfo = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Error",
        description: "Please install MetaMask to view DAO details",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
        daoManager,
        signer
      );

      const tempDaoInfo = await userSideInstance.daoIdtoDao(daoId);
      setDaoInfo(tempDaoInfo);

      const tempDaoMembers = await userSideInstance.getAllDaoMembers(daoId);
      setTotalMembers(tempDaoMembers.length);

      const membershipSignal = await userSideInstance.checkMembership(
        daoId,
        address
      );
      setIsMember(membershipSignal);

      const tempAdminId = tempDaoInfo.creator;
      const tempAdminInfo = await userSideInstance.userIdtoUser(tempAdminId);
      setAdminInfo(tempAdminInfo);

      await loadAllProposals(daoId);

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading DAO info:", error);
      toast({
        title: "Error",
        description: "Failed to load DAO information. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const loadAllProposals = async (daoId: string) => {
    if (typeof window.ethereum === "undefined") {
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
        daoManager,
        signer
      );

      const tempProposalArray = await userSideContract.getAllDaoProposals(
        daoId
      );
      const proposalDetails = await Promise.all(
        tempProposalArray.map(async (proposalId: string) => {
          const tempProposalInfo = await userSideContract.proposalIdtoProposal(
            proposalId
          );
          const governanceTokenContract = new ethers.Contract(
            tempProposalInfo.votingTokenAddress,
            daoToken,
            signer
          );
          const tokenSymbol = await governanceTokenContract.symbol();
          const tokenName = await governanceTokenContract.name();

          return {
            proposalInfo: tempProposalInfo,
            tokenName,
            tokenSymbol,
          };
        })
      );
      setProposalArray(proposalDetails);
    } catch (error) {
      console.error("Error loading proposals:", error);
      toast({
        title: "Error",
        description: "Failed to load proposals. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVote = (proposal: any) => {
    setSelectedProposal(proposal);
    setIsVoteModalOpen(true);
  };

  const handleViewResults = async (proposalId: string) => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "Error",
        description: "Please install MetaMask to view vote results",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
        daoManager,
        signer
      );

      const results = await contract.getProposalResults(proposalId);
      setVoteResults(results);
      setIsVoteResultsModalOpen(true);
    } catch (error) {
      console.error("Error fetching voting results:", error);
      toast({
        title: "Error",
        description: "Failed to fetch voting results. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (!isMember) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4">This DAO is Private</h1>
        <p className="text-xl">You are not a member of this DAO.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <DaoDetails
          daoInfo={daoInfo}
          totalMembers={totalMembers}
          adminInfo={adminInfo}
          isMember={isMember}
          address={address}
          onAddProposal={() => setIsProposalModalOpen(true)}
          onAddMember={() => setIsInviteModalOpen(true)}
        />
        <ProposalTab
          proposalArray={proposalArray}
          isMember={isMember}
          daoId={daoId}
          onVote={handleVote}
          onViewResults={handleViewResults}
        />
        <ProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          daoId={daoId}
          onProposalCreated={() => loadAllProposals(daoId)}
        />
        <VoteModal
          isOpen={isVoteModalOpen}
          onClose={() => setIsVoteModalOpen(false)}
          proposalId={selectedProposal?.proposalInfo.proposalId}
          daoId={daoId}
        />
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          daoId={daoId}
          onMemberInvited={loadDaoInfo}
        />
        <VoteResults
          isOpen={isVoteResultsModalOpen}
          onClose={() => setIsVoteResultsModalOpen(false)}
          yesVotes={voteResults?.yesVotes}
          noVotes={voteResults?.noVotes}
          abstainVotes={voteResults?.abstainVotes}
          finalVerdict={voteResults?.finalVerdict}
        />
      </div>
    </div>
  );
}
