import {
  Center,
  Button,
  useDisclosure,
  Flex,
  Tabs,
  TabList,
  Tab,
  Input,
  SimpleGrid,
  Box,
  Text,
  Link,
  Image,
} from '@chakra-ui/react'

import { RepeatIcon } from '@chakra-ui/icons'
import TradeModal from './TradeModal'
import { useState, useEffect } from "react";
import { useProgramData } from '../../stores/useProgramData'
import { useLoading } from '../../stores/useLoading'
import { SellerEscrowAccountInfo, getAllSellerEscrowAccountsInfo } from '../../smart-contract/accounts'
import { useWeb3 } from '../../stores/useWeb3'
import { FaFilter } from 'react-icons/fa';
import { PublicKey } from '@solana/web3.js'
import { getNFTOnchainMetadata } from '../../utils/web3'
import TokenCard from './TokenCard';
import { shortenHash } from '../../utils';
import SellTokenCard from './SellTokenCard';
import ListTokenModal from './ListTokenModal';

export interface ListedNFTInfo extends SellerEscrowAccountInfo {
  name: string,
  imageUrl: string
}

const SellingTokensBoard = () => {

  const listTokenModal = useDisclosure();
  const [selectedNft, setSelectedNft] = useState<ListedNFTInfo>({
    tokenAddress: "",
    pricePerToken: 0,
    escrowId: "",
    seller: "",
    name: "",
    imageUrl: "./solana_logo.png",
    address: "",
    amount: 0
  });
  const [tokenHasSet, setTokenHasSet] = useState<boolean>(false);
  const { allSellEscrowInfo, setAllSellEscrowInfo } = useProgramData()
  const { setLoading } = useLoading();
  const { connection } = useWeb3();
  const { userTokens } = useWeb3();

  const openTrade = (
    tokenAddress: string,
  ) => {
    //onOpen()
    const selectedToken = listedNFTs.filter((item) => item.tokenAddress === tokenAddress)
    setSelectedNft(selectedToken[0])
  }

  useEffect(() => {
    if (selectedNft) {
      setTokenHasSet(true)

    }
  }, [selectedNft])

  const handleRefresh = async () => {
    setLoading(true);
    const dataArrSE = await getAllSellerEscrowAccountsInfo(connection);
    setAllSellEscrowInfo(dataArrSE);
    setLoading(false);
  }

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [searchedItem, setSearchedItem] = useState<string>("");

  const [listedNFTs, setListedNFTs] = useState<ListedNFTInfo[]>([]);

  const prepareListedNFTs = async () => {
    const tokenData: ListedNFTInfo[] =
      await Promise.all(allSellEscrowInfo.map(async (item) => {
        const onChainMetadata = await getNFTOnchainMetadata(
          new PublicKey(item.tokenAddress),
          connection
        );

        if (onChainMetadata) {
          const respOffChainMetadata = await fetch(onChainMetadata.data.uri);
          const offChainMetadata = await respOffChainMetadata.json();
          const imageUrl = offChainMetadata.image as string;
          return {
            ...item,
            imageUrl: imageUrl,
            name: onChainMetadata.data.name,
          }
        } else {
          return {
            ...item,
            imageUrl: "./solana_logo.png",
            name: "Name not available"
          }
        }
      }));
    setListedNFTs(tokenData);
  }

  useEffect(() => {
    if (allSellEscrowInfo.length > 0) {
      prepareListedNFTs();
    }
  }, [allSellEscrowInfo])

  return (
    <>
      <ListTokenModal 
        onOpen={listTokenModal.onOpen}
        isOpen={listTokenModal.isOpen}
        onClose={listTokenModal.onClose}
      />
      <Flex
        width={"100%"}
        height={"600px"}
        bg={"black"}
        flexDir={"column"}
        borderRadius={"16px"}
      >
        <Flex marginLeft={"16px"}>
          <Tabs
            onChange={(index) => setTabIndex(index)} marginBottom={"4px"}
            colorScheme='orange'
          >
            <TabList>
              <Tab>
                NFTs
              </Tab>
              <Tab>
                Fungible tokens
              </Tab>
            </TabList>
          </Tabs>
        </Flex>
        <Flex flex={1} padding={"16px"}>
          <Center marginRight={"16px"}>
            <FaFilter />

          </Center>
          <Center marginRight={"16px"}>
            <RepeatIcon _hover={{
              cursor: "pointer"
            }}
              boxSize={"20px"}
              onClick={handleRefresh}
            />
          </Center>
          <Flex marginRight={"16px"}>
            <Input
              border={"none"}
              bg={"gray.600"}
              placeholder='search item'
              value={searchedItem}
              onChange={(event) => setSearchedItem(event.target.value)}
            />
          </Flex>
          <Flex>
            <Button
              px={4}
              colorScheme={'orange'}
              bg={'orange.400'}
              _hover={{ bg: 'orange.500' }}
              onClick={listTokenModal.onOpen}
            >
              List Your Token
            </Button>
          </Flex>
        </Flex>
        <Flex flex={24}>
          <SimpleGrid
            columns={5}
            rowGap={8}
            gap={16}
            spacingY='28px'
            overflowY={"auto"}
            maxHeight={"512px"}
            width={"100%"}
            padding={"32px"}
          >
            {listedNFTs.map((item) => {
              return (
                <SellTokenCard
                  item={item}
                  onPurchase={() => {}}
                />
              )
            })}

          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  )

}

export default SellingTokensBoard

//https://images.prismic.io/contrary-research/aea8f5be-f2c4-4a79-b8e7-ccb1d0341cca_Magic+Eden+2.png?auto=compress%2Cformat&fit=max&w=1920