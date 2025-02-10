// @ts-nocheck comment
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { ExternalLink, User, Users } from "lucide-react";
import Link from "next/link";
import daoManager from "@/utils/abi/daoManager.json";
import daoToken from "@/utils/abi/daoToken.json";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const MotionCard = motion(Card);

const Profile = () => {
  const { address } = useAccount();
  const [userDaos, setUserDaos] = useState([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onLoad = async () => {
    if (
      typeof window.ethereum !== "undefined" &&
      window.ethereum._state.accounts.length !== 0
    ) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userSideInstance = new ethers.Contract(
          process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
          daoManager,
          signer
        );

        const tempUserId = await userSideInstance.userWallettoUserId(address);
        const tempUserInfo = await userSideInstance.userIdtoUser(tempUserId);
        setUserInfo(tempUserInfo);

        const tempUserDaos = await userSideInstance.getAllUserDaos(tempUserId);
        const daoPromises = tempUserDaos.map(async (daoId: string) => {
          const tempDaoInfo = await userSideInstance.daoIdtoDao(daoId);
          const tempAdminId = tempDaoInfo.creator;
          const tempAdminInfo = await userSideInstance.userIdtoUser(
            tempAdminId
          );

          const governanceTokenInstance = new ethers.Contract(
            tempDaoInfo.governanceTokenAddress,
            daoToken,
            signer
          );
          const govtTokenName = await governanceTokenInstance.name();
          const govtTokenSymbol = await governanceTokenInstance.symbol();

          return {
            daoInfo: tempDaoInfo,
            creatorInfo: tempAdminInfo,
            tokenName: govtTokenName,
            tokenSymbol: govtTokenSymbol,
          };
        });

        const resolvedDaos = await Promise.all(daoPromises);
        setUserDaos(resolvedDaos);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onLoad();
  }, [address, onLoad]); // Added onLoad to dependencies

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-background/80">
      <motion.div
        className="container mx-auto px-4 py-8 mt-6 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <Avatar className="w-32 h-32 mx-auto mb-4">
            <AvatarImage
              src={`https://gateway.lighthouse.storage/ipfs/${userInfo?.[4]}`}
              alt={userInfo?.[1]}
            />
            <AvatarFallback>
              <User className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          {isLoading ? (
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
          ) : (
            <motion.h1
              className="text-3xl font-bold mb-2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {userInfo?.[1]}
            </motion.h1>
          )}
          {isLoading ? (
            <Skeleton className="h-4 w-32 mx-auto mb-2" />
          ) : (
            <motion.p
              className="text-muted-foreground mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {userInfo?.[2]}
            </motion.p>
          )}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge variant="secondary">Onchain</Badge>
          </motion.div>
        </motion.div>

        <motion.div className="mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <MotionCard
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            >
              <CardContent className="pt-6">{userInfo?.[3]}</CardContent>
            </MotionCard>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-semibold mb-4">My DAOs</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : userDaos.length === 0 ? (
            <MotionCard
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    loop: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Users className="w-12 h-12 mb-4 text-muted-foreground" />
                </motion.div>
                <p className="text-xl font-semibold mb-4">
                  You are not a member of any DAOs yet
                </p>
                <Button asChild>
                  <Link href="/explore">Join a DAO</Link>
                </Button>
              </CardContent>
            </MotionCard>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userDaos.map((dao: any, index: number) => (
                <MotionCard
                  key={dao.daoInfo[0].toString()}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {dao.daoInfo.daoName}
                    </CardTitle>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dao/${dao.daoInfo[0].toString()}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {dao.daoInfo.daoDescription}
                    </p>
                    <motion.div
                      className="mt-2 flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Badge variant="outline">{dao.tokenName}</Badge>
                      <Badge variant="outline">{dao.tokenSymbol}</Badge>
                    </motion.div>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
