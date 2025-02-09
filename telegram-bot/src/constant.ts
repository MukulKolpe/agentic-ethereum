export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "daoName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creatorWallet",
        type: "address",
      },
    ],
    name: "DAOCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "documentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "uploaderWallet",
        type: "address",
      },
    ],
    name: "DocumentUploaded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "userWallet",
        type: "address",
      },
    ],
    name: "MemberAddedToDAO",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "proposerWallet",
        type: "address",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "numTokens",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteChoice",
        type: "uint256",
      },
    ],
    name: "QVVoteCast",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "userName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "userWallet",
        type: "address",
      },
    ],
    name: "UserCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "userWallet",
        type: "address",
      },
    ],
    name: "UserJoinedDAO",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteChoice",
        type: "uint256",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_userWalletAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_adminWalletAddress",
        type: "address",
      },
    ],
    name: "addMembertoDao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_callerWalletAddress",
        type: "address",
      },
    ],
    name: "checkMembership",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractCreationTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_daoName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_daoDescription",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_joiningThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_proposingThreshold",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_joiningTokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_isPrivate",
        type: "bool",
      },
      {
        internalType: "address",
        name: "_userWalletAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_discordID",
        type: "string",
      },
    ],
    name: "createDao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalType",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_proposalTitleAndDesc",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_votingThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_governanceTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_userWalletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_beginningTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endingTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_passingThreshold",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_voteOnce",
        type: "bool",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_userName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_userEmail",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_profileImage",
        type: "string",
      },
      {
        internalType: "address",
        name: "_userWalletAddress",
        type: "address",
      },
    ],
    name: "createUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "daoIdtoDao",
    outputs: [
      {
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "creator",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "daoName",
        type: "string",
      },
      {
        internalType: "string",
        name: "daoDescription",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "joiningThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "proposingThreshold",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "governanceTokenAddress",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isPrivate",
        type: "bool",
      },
      {
        internalType: "string",
        name: "discordID",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "daoIdtoDocuments",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "daoIdtoMembers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "daoIdtoProposals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "documentIdtoDocument",
    outputs: [
      {
        internalType: "uint256",
        name: "documentId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "documentTitle",
        type: "string",
      },
      {
        internalType: "string",
        name: "documentDescription",
        type: "string",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "upoladerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getAllAbstainVotes",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
    ],
    name: "getAllDaoDocuments",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
    ],
    name: "getAllDaoMembers",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
    ],
    name: "getAllDaoProposals",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getAllNoVotes",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_userId",
        type: "uint256",
      },
    ],
    name: "getAllUserDaos",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getAllVoters",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "getAllYesVotes",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_userId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_callerWalletAddress",
        type: "address",
      },
    ],
    name: "joinDao",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposalIdtoAbstainVoters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposalIdtoNoVoters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposalIdtoProposal",
    outputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "proposalType",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "proposalTitleAndDesc",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "proposerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "votingThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "daoId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "votingTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "beginningTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endingTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "passingThreshold",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "voteOnce",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposalIdtoVoters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposalIdtoYesVoters",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "quadraticNoMappings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "quadraticYesMappings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_numTokens",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_callerWalletAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_voteFor",
        type: "uint256",
      },
    ],
    name: "qvVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDaos",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDocuments",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalProposals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalUsers",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_documentTitle",
        type: "string",
      },
      {
        internalType: "string",
        name: "_documentDesc",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_daoId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "uploadDocument",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userIdtoDaos",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userIdtoUser",
    outputs: [
      {
        internalType: "uint256",
        name: "userId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "userName",
        type: "string",
      },
      {
        internalType: "string",
        name: "userEmail",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "profileImage",
        type: "string",
      },
      {
        internalType: "address",
        name: "userWallet",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "userSideAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userWallettoUserId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_voteFor",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_callerWalletAddress",
        type: "address",
      },
    ],
    name: "voteForProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
