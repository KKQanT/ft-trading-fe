import { SimpleGrid, Button, Center, Container } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, Text, Heading, Image } from '@chakra-ui/react';
import { useWeb3 } from "../../stores/useWeb3";
import { useProgramData } from "../../stores/useProgramData";
import { useEffect, useState } from "react";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, Transaction } from "@solana/web3.js";
import { METADATA_PROGRAM_ID } from "../../utils/web3";
import axios from "axios";
import { shortenHash } from "../../utils";
import { getAllDividendVaults, getUserAllShareAccountInfo } from "../../smart-contract/accounts";
import { createClaimShareInstruction, createCreateShareAccountIntruction } from "../../smart-contract/intructions";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useLoading } from "../../stores/useLoading";

interface PreprocessedWlTokenDataType {
  wlAccountAddress: string,
  tokenAddress: string,
  isClaimable: boolean,
  lastClaimedEpoch: number,
  imgUri: string
}

const NFTList = () => {

  const { userTokens, connection, program } = useWeb3();
  const {
    allWhiteListedTokenInfo,
    userShareAccount,
    setUserAllShareAccounts,
    setUserShareAccount,
    setAllDividendVaultInfos
  } = useProgramData();
  const [preprocessedTokensData, setPreprocessedTokensData] = useState<PreprocessedWlTokenDataType[]>([]);
  const { currEpoch } = useWeb3();
  const { setLoading } = useLoading();
  const wallet = useAnchorWallet();

  useEffect(() => {
    preprocessTokensData();
  }, [userTokens, allWhiteListedTokenInfo])

  const preprocessTokensData = async () => {
    const userTokensAddress = userTokens
      .map((item) => { return item.mintAddress });

    const filteredWlTokensInfo = allWhiteListedTokenInfo
      .filter((item) => userTokensAddress.includes(item.tokenAddress));

    const userWlToken: PreprocessedWlTokenDataType[] = [];

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
        lastClaimedEpoch: item.lastClaimedEpoch,
        isClaimable: (item.lastClaimedEpoch < currEpoch) ? true : false,
        imgUri: imgUri
      })
    }

    console.log("userWlToken: ", userWlToken)

    setPreprocessedTokensData(userWlToken);

  }

  if (preprocessedTokensData.length == 0) {
    return (
      <Container>
        <Center >You don't have any of our stocks</Center>
      </Container>
    )
  }

  const reloadData = async () => {

    setLoading(true);

    const dataArrDV = await getAllDividendVaults(connection);
    setAllDividendVaultInfos(dataArrDV);

    const accounts = await getUserAllShareAccountInfo(connection, wallet!.publicKey);
    setUserAllShareAccounts(accounts);
    const filtered = accounts.filter((item) => item.epoch == currEpoch);
    if (filtered.length > 0) {
      setUserShareAccount(filtered[0])
    }

    await preprocessTokensData();

    setLoading(false);

  }

  const handleClaim = async (tokenAddress: PublicKey) => {
    if (program && wallet?.publicKey) {
      setLoading(true)
      const transaction = new Transaction();
      if (!userShareAccount) {
        const createUserShareAccountIx = await createCreateShareAccountIntruction(
          program, currEpoch, wallet?.publicKey
        );
        transaction.add(createUserShareAccountIx);
      }
      const claimShareIx = await createClaimShareInstruction(
        program,
        currEpoch,
        wallet.publicKey,
        tokenAddress
      );
      transaction.add(claimShareIx);
      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;
      setLoading(false);
      const signedTx = await wallet?.signTransaction(transaction);
      const wireTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(wireTx);
      setLoading(true)
      await connection.confirmTransaction(signature, "finalized");
      setLoading(false)
      reloadData();
    }
  }

  return (
    <>
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
        {preprocessedTokensData.map((item) => {
          return (
            <Card>
              <CardHeader>
                <Heading size='md'> {shortenHash(item.tokenAddress)}</Heading>
              </CardHeader>
              <CardBody>
                <Image mb={"1rem"} src={item.imgUri} />
                <Text mb={"1rem"}>last claimed (epoch): {item.lastClaimedEpoch}</Text>
                <Button
                  isDisabled={!item.isClaimable}
                  onClick={() => handleClaim(new PublicKey(item.tokenAddress))}
                >
                  Claim
                </Button>
              </CardBody>
            </Card>
          )
        })}

      </SimpleGrid>
    </>
  )
}

export default NFTList