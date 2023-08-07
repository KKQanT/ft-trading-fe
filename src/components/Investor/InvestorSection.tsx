import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import NFTList from "./NFTList";
import RewardList from "./RewardList";
import Loading from "../Loading/loading";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useWeb3 } from "../../stores/useWeb3"
import { useEffect, useState } from "react";
import { getUserAllShareAccountInfo, userShareAccountType } from "../../smart-contract/accounts";
import { useLoading } from "../../stores/useLoading";

const InvestorSection = () => {

  const wallet = useAnchorWallet();

  const { currEpoch, connection } = useWeb3();
  const [userAllShareAccounts, setUserAllShareAccounts] = useState<userShareAccountType[]>([]);
  const [_userShareAccount, setUserShareAccount] = useState<userShareAccountType|null>(null);
  const {setLoading} = useLoading();

  useEffect(() => {

    if (wallet?.publicKey) {
      getUserShareAccounts();
    }

  }, [wallet?.publicKey])

  const getUserShareAccounts = async () => {
    setLoading(true);
    const accounts = await getUserAllShareAccountInfo(connection);
    setUserAllShareAccounts(accounts);
    const filtered = accounts.filter((item) => item.epoch == currEpoch);
    if (filtered.length > 0) {
      setUserShareAccount(filtered[0])
    }
    setLoading(false);
  }

  return (
    <>
      <Loading />
      <Container maxW={"5xl"} >
        <Stack
          textAlign={'center'}
          align={'center'}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            S3T Trade{' '}
            <Text as={'span'} color={'orange.400'}>
              Investor
            </Text>
          </Heading>

          <Tabs variant='soft-rounded' colorScheme='orange' w={[300, 400, 700]}>
            <TabList>
              <Tab>S3T Trade Stock</Tab>
              <Tab>Dividend</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <NFTList />
              </TabPanel>
              <TabPanel>
                <RewardList userAllShareAccounts={userAllShareAccounts}/>
              </TabPanel>
            </TabPanels>

          </Tabs>
        </Stack>

      </Container>
    </>
  )
}


export default InvestorSection