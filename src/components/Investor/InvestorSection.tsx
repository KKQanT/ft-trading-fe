import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import NFTList from "./NFTList";
import RewardList from "./RewardList";
import Loading from "../Loading/loading";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useWeb3 } from "../../stores/useWeb3"
import { useEffect } from "react";
import { getAllDividendVaults, getUserAllShareAccountInfo } from "../../smart-contract/accounts";
import { useLoading } from "../../stores/useLoading";
import EpochStats from "./EpochStats";
import { useProgramData } from "../../stores/useProgramData";


const InvestorSection = () => {

  const wallet = useAnchorWallet();

  const { currEpoch, connection } = useWeb3();
  const {  setUserAllShareAccounts, setUserShareAccount, setAllDividendVaultInfos } = useProgramData();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (wallet?.publicKey) {
      reloadData();
    }
  }, [wallet?.publicKey])

  const reloadData = async () => {

    setLoading(true);

    const dataArrDV = await getAllDividendVaults(connection);
    setAllDividendVaultInfos(dataArrDV);

    const accounts = await getUserAllShareAccountInfo(connection, wallet!.publicKey);
    console.log("AllShareAccounts: ", accounts)
    setUserAllShareAccounts(accounts);
    const filtered = accounts.filter((item) => item.epoch == currEpoch);
    if (filtered.length > 0) {
      setUserShareAccount(filtered[0])
    } else {
      setUserShareAccount(null)
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
          <EpochStats />
          <Tabs variant='soft-rounded' colorScheme='orange' w={[300, 400, 700]}>
            <TabList>
              <Tab>S3T Trade Stock</Tab>
              <Tab>Claimable Dividend</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <NFTList />
              </TabPanel>
              <TabPanel>
                <RewardList />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>

      </Container>
    </>
  )
}


export default InvestorSection