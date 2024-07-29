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
import { getNFTOnchainMetadata, signAndSendTransaction } from '../../utils/web3'
import TokenCard from './TokenCard';
import { shortenHash } from '../../utils';
import SellTokenCard from './SellTokenCard';
import ListTokenModal from './ListTokenModal';
import { createBuyTransaction } from '../../smart-contract/intructions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

export interface ListedNFTInfo extends SellerEscrowAccountInfo {
  name: string,
  imageUrl: string,
  isLoading: boolean
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
    amount: 0,
    isLoading: false
  });
  const [tokenHasSet, setTokenHasSet] = useState<boolean>(false);
  const { allSellEscrowInfo, setAllSellEscrowInfo } = useProgramData()
  const { setLoading } = useLoading();
  const { connection, program, currEpoch } = useWeb3()
  const wallet = useAnchorWallet();

  const openTrade = (
    tokenAddress: string,
  ) => {
    //onOpen()
    const selectedToken = listedNFTs.filter((item) => item.tokenAddress === tokenAddress)
    setSelectedNft(selectedToken[0])
  }

  const handlePurchaseNFT = async (tokenInfo: ListedNFTInfo) => {
    if (program && wallet) {
      try {
        const buyTx = await createBuyTransaction(
          connection,
          program,
          new PublicKey(tokenInfo.escrowId),
          new PublicKey(tokenInfo.seller),
          wallet.publicKey,
          new PublicKey(tokenInfo.tokenAddress),
          1,
          currEpoch
        );

        setDisplayNFTItemLoadingStatus(tokenInfo.address, true)

        const signature = await signAndSendTransaction(
          buyTx,
          wallet,
          connection
        );

        await connection.confirmTransaction(signature, "confirmed");

        removeDisplayNFTItem(tokenInfo.address)

      } catch (err) {
        console.log(err)
        setDisplayNFTItemLoadingStatus(tokenInfo.address, true)
      }

    }
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
      await Promise.all(allSellEscrowInfo.filter(item => item.amount > 0).map(async (item) => {
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
            isLoading: false
          }
        } else {
          return {
            ...item,
            imageUrl: "./solana_logo.png",
            name: "Name not available",
            isLoading: false
          }
        }
      }));
    setListedNFTs(tokenData);
  }

  const setDisplayNFTItemLoadingStatus = (
    escrowAddress: string,
    loadingStatus: boolean
  ) => {
    const listedNFTs_ = [...listedNFTs];
    listedNFTs_.map((item) => {
      if (item.address === escrowAddress) {
        item.isLoading = loadingStatus
      }
    });
    setListedNFTs(listedNFTs_)
  }

  const removeDisplayNFTItem = (escrowAddress: string) => {
    const listedNFTs_ = listedNFTs.filter((item) => item.address !== escrowAddress);;
    setListedNFTs(listedNFTs_)
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
        height={"660px"}
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
            rowGap={24}
            gap={16}
            spacingY='28px'
            overflowY={"auto"}
            maxHeight={"512px"}
            width={"100%"}
            padding={"32px"}
            bg={"black"}
          >
            {listedNFTs.sort(
              (a, b) =>
                (a.address < b.address) ? -1 : (a.address > b.address) ? 1 : 0
            ).map((item) => {
              return (
                <SellTokenCard
                  key={item.address}
                  item={item}
                  onPurchase={() => { handlePurchaseNFT(item) }}
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