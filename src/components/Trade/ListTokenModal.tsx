import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftAddon,
  HStack,
  VStack,
  Text,

} from '@chakra-ui/react'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'


import { useWeb3 } from '../../stores/useWeb3';
import shortenHash from '../../utils';
import { useState } from "react";
import { createSellTransaction } from '../../smart-contract/intructions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface PropType {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}


function ListTokenModal(
  { isOpen, onOpen, onClose }: PropType
) {
  const { userTokens, connection, program } = useWeb3();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const wallet = useAnchorWallet();

  const handleSell = async () => {
    if (program && connection && wallet?.publicKey && selectedToken) {
      const transaction = await createSellTransaction(
        connection,
        program,
        wallet?.publicKey,
        new PublicKey(selectedToken),
        tokenAmount,
        price
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

      const signedTx = await wallet.signTransaction(transaction);
      const wireTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(wireTx, { skipPreflight: true });
      console.log(signature);
    }

  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent alignSelf={"center"}>
          <ModalHeader>List Your Tokens</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant='striped' colorScheme='orange' size='sm'>
                <Thead>
                  <Tr>
                    <Th>Token Address</Th>
                    <Th isNumeric>Amount</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {userTokens.map((item) => {
                    return (
                      <Tr>
                        <Td>{shortenHash(item.mintAddress)}</Td>
                        <Td isNumeric>{item.tokenBalance}</Td>
                        <Td>
                          <Button onClick={() => setSelectedToken(item.mintAddress)} >Select</Button>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>

          {selectedToken &&
            <ModalFooter>
              <VStack spacing={"1rem"}>
                <Text>TOKEN ADDRESS: {shortenHash(selectedToken, 10)}</Text>
                <HStack>
                  <InputGroup>
                    <InputLeftAddon children='Price' />
                    <Input placeholder='SOL/TOKEN' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Amount' />
                    <Input />
                  </InputGroup>
                </HStack>
                <Button width={"full"} colorScheme='orange' mr={3} onClick={handleSell}>
                  List
                </Button>
              </VStack>
            </ModalFooter>
          }

        </ModalContent>
      </Modal>
    </>
  )
}

export default ListTokenModal;