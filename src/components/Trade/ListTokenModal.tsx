import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  SimpleGrid,
  Center,
  Flex,
  Switch,

} from '@chakra-ui/react'

import { useWeb3 } from '../../stores/useWeb3';
import React, { useEffect, useState } from "react";
import { createSellTransaction } from '../../smart-contract/intructions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useProgramData } from '../../stores/useProgramData';
import { getAllSellerEscrowAccountsInfo } from '../../smart-contract/accounts';
import { useLoading } from '../../stores/useLoading';
import TokenCard from './TokenCard';
import { UserTokenType } from '../../utils/web3';

interface PropType {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}

export interface AvailableNft extends UserTokenType {
  selected: boolean
}

function ListTokenModal(
  { isOpen, onClose }: PropType
) {
  const { userTokens, connection, program } = useWeb3();
  const wallet = useAnchorWallet();
  const { setAllSellEscrowInfo } = useProgramData();
  const { setLoading } = useLoading();
  const [nftTokenAddressesToSell, setNftTokenAddressesToSell] = useState<string[]>([])
  const [availableNfts, setAvailableNfts] = useState<AvailableNft[]>([]);

  useEffect(() => {
    const data = userTokens.map((item) => {
      return { ...item, selected: false }
    });

    setAvailableNfts(data);
  }, [userTokens])

  const handleSelect = (tokenAddress: string) => {
    const updatedList = availableNfts.map((item) => {
      if (item.tokenAddress === tokenAddress) {
        return { ...item, selected: !item.selected }
      }
      return item
    });

    setAvailableNfts(updatedList)
  }

  useEffect(() => {
    console.log(nftTokenAddressesToSell)
  }, [nftTokenAddressesToSell])

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {

    const updatedList = availableNfts.map((item) => {
      return { ...item, selected: event.target.checked }
    });
    setAvailableNfts(updatedList)
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={
        () => {
          onClose();
          setNftTokenAddressesToSell([])
        }
      }>
        <ModalOverlay />
        <ModalContent
          alignSelf={"center"}
          maxWidth={"512px"}
          color={"white"}
          bg={"black"}
          borderColor={"white"}
          border={"1px"}
        >
          <ModalHeader>
            <Text >
              List your tokens for sell
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              justifyContent={"flex-end"}
            >
              <Flex
                justifyContent={"space-between"}
                marginBottom={"16px"}
              >
                <Text
                  marginRight={"8px"}
                >
                  Select All
                </Text>
                <Switch
                  margin={"auto"}
                  colorScheme='orange'
                  onChange={handleSelectAll}
                />
              </Flex>
            </Flex>
            <SimpleGrid
              minChildWidth="128px"
              spacing="28px"
              alignItems="center"
              justifyContent="center"
              overflowY={"scroll"}
              maxHeight={"512px"}
            >
              {availableNfts.map((item) => {
                return (
                  <TokenCard
                    key={item.tokenAddress}
                    tokenObj={item}
                    handleOnClick={() => { handleSelect(item.tokenAddress) }}
                  />
                )
              })}

            </SimpleGrid>
          </ModalBody>
          <ModalFooter>

            < Center width={"100%"}>
              <Button
                width={"25%"}
                isDisabled={availableNfts.filter(item => item.selected).length === 0}
                onClick={() => { }}>
                NEXT
              </Button>
            </Center>

          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  )
}

export default ListTokenModal;