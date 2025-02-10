// @ts-nocheck comment
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box } from "@/components/ui/Box";
import { Container } from "@/components/ui/Container";
import { Grid } from "@/components/ui/Grid";
import { Spinner } from "@/components/Spinner";
import DaosCard from "@/components/DaosCard/DaosCard";
import daomanager from "@/utils/abi/daoManager.json";
import daoToken from "@/utils/abi/daoToken.json";

export default function Explore() {
  const [daos, setDaos] = useState([]);
  const [totaluserDAO, setTotaluserDAO] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const onLoad = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAOMANAGER_ADDRESS!,
        daomanager,
        signer
      );
      const tempTotalDaos = Number(await userSideInstance.s_totalDaos());
      let tempCreatorId,
        tempDaoInfo,
        tempCreatorInfo,
        tempTokenAddress,
        tempTokenName,
        tempTokenSymbol;

      for (let i = 1; i <= tempTotalDaos; i++) {
        tempDaoInfo = await userSideInstance.daoIdtoDao(i);
        tempCreatorId = Number(tempDaoInfo.creator);
        tempCreatorInfo = await userSideInstance.userIdtoUser(tempCreatorId);
        tempTokenAddress = tempDaoInfo.governanceTokenAddress;
        const governanceTokenInstance = new ethers.Contract(
          tempTokenAddress,
          daoToken,
          signer
        );
        tempTokenName = await governanceTokenInstance.name();
        tempTokenSymbol = await governanceTokenInstance.symbol();
        setDaos((daos) => [
          ...daos,
          {
            daoInfo: tempDaoInfo,
            creatorInfo: tempCreatorInfo,
            tokenName: tempTokenName,
            tokenSymbol: tempTokenSymbol,
          },
        ]);
      }

      const totalUsersDAO = await userSideInstance.getAllDaoMembers(
        tempDaoInfo.daoId
      );
      setTotaluserDAO(totalUsersDAO.length);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <Box className="min-h-screen bg-background flex items-center justify-center pt-16">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Spinner size="xl" className="text-primary" />
          <h2 className="mt-4 text-lg font-semibold">Loading Public DAOs</h2>
        </div>
      ) : (
        <Container className="py-12">
          <Grid className="gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {daos
              .filter((dao) => dao.daoInfo.isPrivate === false)
              .map((dao, index) => (
                <DaosCard
                  key={index}
                  daoName={dao.daoInfo.daoName}
                  joiningThreshold={dao.daoInfo.joiningThreshold}
                  creatorName={dao.creatorInfo.userName}
                  tokenName={dao.tokenName}
                  tokenSymbol={dao.tokenSymbol}
                  totalDaoMember={totaluserDAO}
                  daoId={dao.daoInfo.daoId}
                />
              ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
}
