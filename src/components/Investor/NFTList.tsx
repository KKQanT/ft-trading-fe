import { SimpleGrid, Button, Center } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, Text, Heading, Image } from '@chakra-ui/react';
import { useWeb3 } from "../../stores/useWeb3";
import { useProgramData } from "../../stores/useProgramData";
import { useEffect, useState } from "react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey } from "@solana/web3.js";
import { METADATA_PROGRAM_ID, getSolanaTime } from "../../utils/web3";
import axios from "axios";
import shortenHash from "../../utils";

interface PreprocessedWlTokenDataType {
  wlAccountAddress: string,
  tokenAddress: string,
  shareClaimable: number,
  imgUri: string
}

const NFTList = () => {

  const { userTokens, connection } = useWeb3();
  const { allWhiteListedTokenInfo } = useProgramData();
  const [preprocessedTokensData, setPreprocessedTokensData] = useState<PreprocessedWlTokenDataType[]>([]);

  useEffect(() => {
    preprocessTokensData();
  }, [userTokens, allWhiteListedTokenInfo])

  const preprocessTokensData = async () => {
    const userTokensAddress = userTokens
      .map((item) => { return item.mintAddress });

    const filteredWlTokensInfo = allWhiteListedTokenInfo
      .filter((item) => userTokensAddress.includes(item.tokenAddress));

    const userWlToken: PreprocessedWlTokenDataType[] = [];
    const solanaCurrTime = await getSolanaTime(connection);

    for (const item of filteredWlTokensInfo) {
      const [metadataAddress] = await PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          (new PublicKey(METADATA_PROGRAM_ID)).toBuffer(),
          (new PublicKey(item.tokenAddress)).toBuffer(),
        ],
        new PublicKey(METADATA_PROGRAM_ID)
      );
      const res = await Metadata.fromAccountAddress(connection, metadataAddress);
      const offChainRes = await axios.get(res.data.uri);
      const imgUri = offChainRes.data.image as string;

      userWlToken.push({
        wlAccountAddress: item.address,
        tokenAddress: item.tokenAddress,
        shareClaimable: solanaCurrTime! - item.lastClaimedTs,
        imgUri: imgUri
      })
    }

    console.log(userWlToken)

    setPreprocessedTokensData(userWlToken);

  }

  if (preprocessedTokensData.length == 0) {
    return <Center>You hold any of our stocks</Center>
  }

  return (
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      {preprocessedTokensData.map((item) => {
        return (
          <Card>
            <CardHeader>
              <Heading size='md'> {shortenHash(item.tokenAddress)}</Heading>
            </CardHeader>
            <CardBody>
              <Image mb={"1rem"} src={item.imgUri} />
              <Text mb={"1rem"}>claimable share: {item.shareClaimable}</Text>
              <Button >Claim</Button>
            </CardBody>
          </Card>
        )
      })}

    </SimpleGrid>
  )
}

export default NFTList