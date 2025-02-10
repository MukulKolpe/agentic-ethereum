import { ethers } from "ethers";
import daoManager from "@/utils/abi/daoManager.json";

export const handleVote = async (proposalId: number, daoId: string) => {
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed");
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

    // Implement the voting logic here
    // This is a placeholder and should be replaced with the actual voting function from your smart contract
    const tx = await contract.vote(proposalId, 1); // Assuming 1 is a "Yes" vote

    await tx.wait();
    console.log("Vote cast successfully");
  } catch (error) {
    console.error("Error casting vote:", error);
  }
};

export const handleViewResults = async (proposalId: number, daoId: string) => {
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed");
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

    // Implement the logic to fetch and display voting results
    // This is a placeholder and should be replaced with the actual function from your smart contract
    const results = await contract.getProposalResults(proposalId);
    console.log("Voting results:", results);

    // Return the results so they can be displayed in the UI
    return results;
  } catch (error) {
    console.error("Error fetching voting results:", error);
  }
};
