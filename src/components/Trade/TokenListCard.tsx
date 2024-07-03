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

export interface ListedNFTInfo extends SellerEscrowAccountInfo {
  name: string,
  imageUrl: string
}

const TokenListCard = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
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
    onOpen()
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
      <Flex
        width={"100%"}
        height={"512px"}
        bg={"black"}
        flexDir={"column"}
        borderRadius={"16px"}
      >
        <Flex marginLeft={"16px"}>
          <Tabs onChange={(index) => setTabIndex(index)} marginBottom={"4px"}>
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
              onClick={onOpen}
            >
              List Your Token
            </Button>
          </Flex>
        </Flex>
        <Flex flex={24}>
          <SimpleGrid
            columns={5}
            spacingY='28px'
            overflowY={"auto"}
            maxHeight={"512px"}
            width={"100%"}
            padding={"32px"}
          >
            {listedNFTs.map((item) => {
              return (
                <Box
                  id={item.tokenAddress}
                  display={"flex"}
                  flexDir={"column"}
                  width={"128px"}
                  height={"128px"}
                >
                  <Image
                    cursor={"pointer"}
                    src={item.imageUrl}
                    width={"128px"}
                    height={"128px"}
                    borderRadius={"8px"}
                  />

                  <Text marginTop={"8px"} alignSelf={"self-start"}>
                    <Link
                      href={`https://explorer.solana.com/address/${item.tokenAddress}?cluster=devnet`}
                      target="_blank"
                    >
                      {shortenHash(item.name, 7)}
                    </Link>
                  </Text>

                  <Flex
                    justifyContent={"space-between"}
                    marginTop={"4px"}
                  >
                    <Flex>
                      <Flex margin={"auto"}>
                        <svg width="20" height="20" viewBox="0 0 101 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100.48 69.3817L83.8068 86.8015C83.4444 87.1799 83.0058 87.4816 82.5185 87.6878C82.0312 87.894 81.5055 88.0003 80.9743 88H1.93563C1.55849 88 1.18957 87.8926 0.874202 87.6912C0.558829 87.4897 0.31074 87.2029 0.160416 86.8659C0.0100923 86.529 -0.0359181 86.1566 0.0280382 85.7945C0.0919944 85.4324 0.263131 85.0964 0.520422 84.8278L17.2061 67.408C17.5676 67.0306 18.0047 66.7295 18.4904 66.5234C18.9762 66.3172 19.5002 66.2104 20.0301 66.2095H99.0644C99.4415 66.2095 99.8104 66.3169 100.126 66.5183C100.441 66.7198 100.689 67.0067 100.84 67.3436C100.99 67.6806 101.036 68.0529 100.972 68.415C100.908 68.7771 100.737 69.1131 100.48 69.3817ZM83.8068 34.3032C83.4444 33.9248 83.0058 33.6231 82.5185 33.4169C82.0312 33.2108 81.5055 33.1045 80.9743 33.1048H1.93563C1.55849 33.1048 1.18957 33.2121 0.874202 33.4136C0.558829 33.6151 0.31074 33.9019 0.160416 34.2388C0.0100923 34.5758 -0.0359181 34.9482 0.0280382 35.3103C0.0919944 35.6723 0.263131 36.0083 0.520422 36.277L17.2061 53.6968C17.5676 54.0742 18.0047 54.3752 18.4904 54.5814C18.9762 54.7875 19.5002 54.8944 20.0301 54.8952H99.0644C99.4415 54.8952 99.8104 54.7879 100.126 54.5864C100.441 54.3849 100.689 54.0981 100.84 53.7612C100.99 53.4242 101.036 53.0518 100.972 52.6897C100.908 52.3277 100.737 51.9917 100.48 51.723L83.8068 34.3032ZM1.93563 21.7905H80.9743C81.5055 21.7907 82.0312 21.6845 82.5185 21.4783C83.0058 21.2721 83.4444 20.9704 83.8068 20.592L100.48 3.17219C100.737 2.90357 100.908 2.56758 100.972 2.2055C101.036 1.84342 100.99 1.47103 100.84 1.13408C100.689 0.79713 100.441 0.510296 100.126 0.308823C99.8104 0.107349 99.4415 1.24074e-05 99.0644 0L20.0301 0C19.5002 0.000878397 18.9762 0.107699 18.4904 0.313848C18.0047 0.519998 17.5676 0.821087 17.2061 1.19848L0.524723 18.6183C0.267681 18.8866 0.0966198 19.2223 0.0325185 19.5839C-0.0315829 19.9456 0.0140624 20.3177 0.163856 20.6545C0.31365 20.9913 0.561081 21.2781 0.875804 21.4799C1.19053 21.6817 1.55886 21.7896 1.93563 21.7905Z" fill="url(#paint0_linear_174_4403)" />
                          <defs>
                            <linearGradient id="paint0_linear_174_4403" x1="8.52558" y1="90.0973" x2="88.9933" y2="-3.01622" gradientUnits="userSpaceOnUse">
                              <stop offset="0.08" stop-color="#9945FF" />
                              <stop offset="0.3" stop-color="#8752F3" />
                              <stop offset="0.5" stop-color="#5497D5" />
                              <stop offset="0.6" stop-color="#43B4CA" />
                              <stop offset="0.72" stop-color="#28E0B9" />
                              <stop offset="0.97" stop-color="#19FB9B" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </Flex>
                      <Text padding={"4px"} margin={"auto"} >{item.pricePerToken}</Text>
                    </Flex>
                    <Button
                      marginY={"auto"}
                      height={"24px"}
                      colorScheme={'orange'}
                      bg={'orange.400'}
                      _hover={{ bg: 'orange.500' }}
                      onClick={onOpen}
                      fontSize={"sm"}
                      fontWeight={"light"}
                    >
                      Buy
                    </Button>
                  </Flex>

                </Box>
              )
            })}

          </SimpleGrid>
        </Flex>
      </Flex>
    </>
  )

}

export default TokenListCard