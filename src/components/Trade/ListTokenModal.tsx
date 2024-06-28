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
  Box,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

} from '@chakra-ui/react'

import { useWeb3 } from '../../stores/useWeb3';
import React, { useEffect, useState } from "react";
import { createSellTransaction } from '../../smart-contract/intructions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { useProgramData } from '../../stores/useProgramData';
import { getAllSellerEscrowAccountsInfo } from '../../smart-contract/accounts';
import { useLoading } from '../../stores/useLoading';
import TokenCard from './TokenCard';
import { UserTokenType, signAndSendBulkTransactions } from '../../utils/web3';
import { shortenHash } from '../../utils';

interface PropType {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}

export interface AvailableNft extends UserTokenType {
  selected: boolean
  price: number
}

enum Step {
  SelectToken,
  SelectPrice
}

function ListTokenModal(
  { isOpen, onClose }: PropType
) {
  const { userTokens, connection, program } = useWeb3();
  const wallet = useAnchorWallet();
  const { setAllSellEscrowInfo } = useProgramData();
  const { setLoading } = useLoading();
  const [availableNfts, setAvailableNfts] = useState<AvailableNft[]>([]);
  const [step, setStep] = useState<Step>(Step.SelectToken)

  const resetAvailableNfts = () => {
    const data = userTokens.map((item) => {
      return { ...item, selected: false, price: 0 }
    });
    setAvailableNfts(data);
  }

  useEffect(() => {
    resetAvailableNfts()
  }, [userTokens])



  useEffect(() => {
    console.log('prices: ', availableNfts.map((item) => item.price))
  }, [availableNfts])

  const handleSelect = (tokenAddress: string) => {
    const updatedList = availableNfts.map((item) => {
      if (item.tokenAddress === tokenAddress) {
        return { ...item, selected: !item.selected, price: 0 }
      }
      return item
    });

    setAvailableNfts(updatedList)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {

    const updatedList = availableNfts.map((item) => {
      return { ...item, selected: event.target.checked }
    });
    setAvailableNfts(updatedList)
  }

  const setPrice = (
    numberInput: string,
    tokenAddress: string
  ) => {
    const updatedList = availableNfts.map((item) => {
      if (item.tokenAddress === tokenAddress) {
        return { ...item, price: parseFloat(numberInput) }
      }
      return item
    });
    setAvailableNfts(updatedList)
  }

  const handleSellItems = async () => {

    if (program && connection && wallet?.publicKey) {
      
      const transactions: Transaction[] = []
      
      await Promise.all(availableNfts
        .filter((item) => item.selected)
        .map(async (item) => {
        const transaction = await createSellTransaction(
          connection,
          program,
          wallet?.publicKey,
          new PublicKey(item.tokenAddress),
          1,
          item.price * LAMPORTS_PER_SOL
        );
        transactions.push(transaction);
      }));
      
      const signatures = await signAndSendBulkTransactions(
        transactions,
        wallet,
        connection
      );
      
      await Promise.all(signatures.map(async (signature) => {
        await connection.confirmTransaction(signature, "confirmed")
      }))
      
      onClose();

      const updatedList = availableNfts.filter((item) => !item.selected);
      setAvailableNfts(updatedList);

      setStep(Step.SelectToken);
      
    }

  }

  const handleCloseListTokenModel = () => {
    onClose();
    resetAvailableNfts();
    setStep(Step.SelectToken);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseListTokenModel}>
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
          {step == Step.SelectToken && (
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
            </ModalBody>)
          }
          {step == Step.SelectPrice && (
            <ModalBody>
              <SimpleGrid
                columns={1}
                spacingY='28px'
                overflowY={"scroll"}
                maxHeight={"512px"}
              >
                {availableNfts.filter((item) => (item.selected)).map((item) => {
                  return (
                    <Flex
                      maxHeight={"128px"}
                      flexDir={"column"}
                      justifyContent={"space-between"}
                      padding={"16px"}
                      key={item.tokenAddress}
                    >

                      <Flex
                        maxHeight={"128px"}
                        maxWidth={"100%"}
                        flexDir={"row"}
                        justifyContent={"space-between"}
                      >

                        <Image
                          src={item.imageUrl ? item.imageUrl : "./solana_logo.png"}
                          maxWidth={"96px"}

                        />
                        <Flex flexDir={"column"}>
                          <Flex>
                            <Text width={"100%"} textAlign={"start"}>
                              {shortenHash(item.name!, 7)}
                            </Text>
                          </Flex>
                          <Flex>
                            <Text width={"100%"} textAlign={"start"}>
                              {shortenHash(item.tokenAddress!, 5)}
                            </Text>
                          </Flex>
                        </Flex>

                        <Flex
                          width={"40%"}
                          flexDir={"column"}
                        >
                          <Flex
                            justifyContent={"flex-end"}>
                            Price (SOL)
                          </Flex>
                          <NumberInput
                            alignSelf={"flex-end"}
                            bg={"gray"}
                            border={"none"}
                            height={"32px"}
                            width={"128px"}
                            defaultValue={item.price}
                            onChange={(numberInput) => setPrice(numberInput, item.tokenAddress)}
                            min={0}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper color={"white"} />
                              <NumberDecrementStepper color={"white"} />
                            </NumberInputStepper>
                          </NumberInput>
                        </Flex>

                      </Flex>

                    </Flex>
                  )
                })}
              </SimpleGrid>
            </ModalBody>)
          }
          <ModalFooter>

            {(step == Step.SelectToken) &&
              (< Center width={"100%"}>
                <Button
                  width={"128px"}
                  isDisabled={availableNfts.filter(item => item.selected).length === 0}
                  onClick={() => { setStep(Step.SelectPrice) }}>
                  NEXT
                </Button>
              </Center>)
            }

            {(step == Step.SelectPrice) && (
              < Center width={"100%"}>
                <Flex
                  width={"288px"}
                  justifyContent={"space-between"}>
                  <Button
                    width={"128px"}
                    onClick={() => {setStep(Step.SelectToken)}}
                  >
                    Back
                  </Button>
                  <Button
                    width={"128px"}
                    isDisabled={availableNfts.filter(
                      (item => ((item.selected) && (item.price == 0)))
                    ).length > 0}
                    onClick={handleSellItems}
                  >
                    LIST
                  </Button>
                </Flex>
              </Center>
            )}

          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  )
}

export default ListTokenModal;