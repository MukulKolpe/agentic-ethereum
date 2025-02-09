import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  cdpWalletActionProvider,
  EvmWalletProvider,
  customActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as readline from "readline";
import { encodeFunctionData, Hex } from "viem";
import z from "zod";
import { abi } from "./constant";
import { Telegraf, Markup } from "telegraf";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const WALLET_DATA_FILE = "wallet_data.txt";

/**
 * Initialize the agent with CDP Agentkit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
  try {
    // Initialize LLM
    const llm = new ChatOpenAI({
      modelName: "llama70b",
      apiKey: process.env.GAIA_API, // you can input your API key in plaintext, but this is not recommended
      configuration: {
        baseURL: "https://llama70b.gaia.domains/v1",
        defaultHeaders: {
          "Content-Type": "application/json",
        },
      },
      maxTokens: 2048, // specifies the maximum number of tokens to generate
      temperature: 0.7, // specifies the randomness of the output
      topP: 0.9, // specifies the top-p sampling parameter
    });
    let walletDataStr: string | null = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_FILE)) {
      try {
        walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
      } catch (error) {
        console.error("Error reading wallet data:", error);
        // Continue without wallet data
      }
    }

    // Configure CDP Wallet Provider
    const config = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
      cdpWalletData: walletDataStr || undefined,
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    const walletProvider = await CdpWalletProvider.configureWithWallet(config);

    // Initialize AgentKit
    const agentkit = await AgentKit.from({
      walletProvider,
      actionProviders: [
        wethActionProvider(),
        registerUser,
        createDao,
        walletActionProvider(),
        cdpWalletActionProvider({
          apiKeyName: process.env.CDP_API_KEY_NAME,
          apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
            /\\n/g,
            "\n"
          ),
        }),
      ],
    });

    const tools = await getLangChainTools(agentkit);

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "CDP AgentKit Chatbot Example!" },
    };

    // Create React Agent using the LLM and CDP AgentKit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a highly capable DAO agent specializing in deploying ERC-20 governance tokens, summarizing proposals, and assisting users in voting on proposals, registering on platform. Your goal is to streamline decentralized governance by providing clear, actionable insights into DAO activities. When a user requests to deploy a governance token, ensure it aligns with standard ERC-20 functionality and governance requirements. When summarizing proposals, extract key details such as the proposal’s purpose, voting options, deadlines, and any relevant on-chain data. For voting assistance, guide users through the process, ensuring they understand the implications of their choices.ou are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, and 
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
        restating your tools' descriptions unless it is explicitly requested.
        `,
    });

    // Save wallet data
    const exportedWallet = await walletProvider.exportWallet();

    fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error; // Re-throw to be handled by caller
  }
}

/**
 * Start the telegram bot
 */
async function main() {
  try {
    const { agent, config } = await initializeAgent();

    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback("🛠 Create DAO", "create_dao")],
      [Markup.button.callback("👤 Register", "register_user")],
    ]);

    // Start command with menu
    bot.start((ctx) => {
      ctx.reply("🚀 Welcome to the DAO Bot! Choose an action:", keyboard);
    });

    // Handle "Create DAO" button click
    bot.action("create_dao", async (ctx) => {
      ctx.reply(
        "✍️ Please send the DAO details in the following format:\n\n" +
          "`DAO Name: MyDAO`\n" +
          "`Description: A decentralized platform...`\n" +
          "`Joining Threshold: 100`\n" +
          "`Proposing Threshold: 200`\n" +
          "`Joining Token Address: 0x...`\n" +
          "`Is Private: true/false`\n" +
          "`User Wallet Address: 0x...`\n" +
          { parse_mode: "Markdown" }
      );
    });

    // Handle "Register" button click
    bot.action("register_user", async (ctx) => {
      ctx.reply(
        "🔹 To register, please provide your details in the following format:\n\n" +
          "`Name: John Doe`\n" +
          "`Wallet Address: 0x...`\n" +
          "`Email: jack@gmail.com" +
          "`Profile description: A short bio about your profile`\n" +
          "`Profile Image: (Link): `",
        { parse_mode: "Markdown" }
      );
    });

    bot.on("text", async (ctx) => {
      const userInput = ctx.message.text;
      ctx.reply(
        "Processing your request. Please be patient this may take a few minutes ⏳ ..."
      );

      try {
        const stream = await agent.stream(
          { messages: [{ type: "user", content: userInput }] },
          config
        );
        let response = "";
        for await (const chunk of stream) {
          if ("tools" in chunk) {
            response += chunk.tools.messages[0].content + "\n";
          }
        }

        // Send the final response to the user
        ctx.reply(response.trim()) ||
          ctx.reply("An error occurred while processing your request.");
      } catch (error) {
        console.error("Error processing request:", error);
        ctx.reply("An error occurred while processing your request.");
      }
    });

    bot.launch();
    console.log("Bot started!");

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  console.log("Starting Agent...");
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

const registerUser = customActionProvider<EvmWalletProvider>({
  // wallet types specify which providers can use this action. It can be as generic as WalletProvider or as specific as CdpWalletProvider
  name: "register_myself",
  description:
    "Registers a user on the platform by taking in basic user information",
  schema: z
    .object({
      userName: z
        .string()
        .min(1, "Username is required")
        .max(50, "Username must be less than 50 characters"),

      userEmail: z
        .string()
        .email("Invalid email format")
        .min(1, "Email is required"),

      description: z
        .string()
        .max(500, "Description must be less than 500 characters")
        .optional(),

      profileImage: z.string().url("Invalid image URL format").optional(),

      userWalletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
    })
    .strip(),
  invoke: async (walletProvider: EvmWalletProvider, args: any) => {
    const {
      userName,
      userEmail,
      description,
      profileImage,
      userWalletAddress,
    } = args;

    // Perform the action here

    const hash = await walletProvider.sendTransaction({
      to: "0xE0f8479Ac93371fC7978A0F7d0321caabf1cd5FA" as Hex,
      data: encodeFunctionData({
        abi: abi,
        functionName: "createUser",
        args: [
          userName,
          userEmail,
          description,
          profileImage,
          userWalletAddress,
        ],
      }),
    });

    await walletProvider.waitForTransactionReceipt(hash);

    const message = `🎉 Resgistration successfull! 🎉. Registerd with name: ${userName} and email: ${userEmail}.Here is the tx: https://sepolia.basescan.org/tx/${hash}`;

    return message;
  },
});

const createDao = customActionProvider<EvmWalletProvider>({
  name: "create_dao",
  description: "Creates a new DAO on the platform with specified parameters",
  schema: z
    .object({
      daoName: z
        .string()
        .min(1, "DAO name is required")
        .max(50, "DAO name must be less than 50 characters"),

      daoDescription: z
        .string()
        .max(1000, "DAO description must be less than 1000 characters"),

      joiningThreshold: z
        .number()
        .or(z.string().transform((val) => Number(val))) // Transform string to number
        .pipe(z.number().min(0, "Joining threshold must be non-negative")),

      proposingThreshold: z
        .number()
        .or(z.string().transform((val) => Number(val))) // Transform string to number
        .pipe(z.number().min(0, "Proposing threshold must be non-negative")),

      joiningTokenAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid token address format"),

      isPrivate: z
        .boolean()
        .or(z.string().transform((val) => val === "true")) // Transform string to boolean
        .pipe(z.boolean()),

      userWalletAddress: z
        .string()
        .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),

      discordID: z.string().default(""), // Always passing empty string as default
    })
    .strip(),
  invoke: async (walletProvider: EvmWalletProvider, args: any) => {
    const {
      daoName,
      daoDescription,
      joiningThreshold,
      proposingThreshold,
      joiningTokenAddress,
      isPrivate,
      userWalletAddress,
      discordID,
    } = args;

    const hash = await walletProvider.sendTransaction({
      to: "0xE0f8479Ac93371fC7978A0F7d0321caabf1cd5FA" as Hex,
      data: encodeFunctionData({
        abi: abi,
        functionName: "createDao",
        args: [
          daoName,
          daoDescription,
          Number(joiningThreshold),
          Number(proposingThreshold),
          joiningTokenAddress,
          isPrivate,
          userWalletAddress,
          discordID,
        ],
      }),
    });

    await walletProvider.waitForTransactionReceipt(hash);

    console.log(hash);

    const message = `🎉 DAO ${daoName} Successfully Created! 🎉 . Your wallet address is ${userWalletAddress}. Here is the tx: https://sepolia.basescan.org/tx/${hash}`;

    return message;
  },
});
