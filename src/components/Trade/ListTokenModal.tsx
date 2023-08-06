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

interface PropType {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}


function ListTokenModal(
  { isOpen, onOpen, onClose }: PropType
) {
  const { userTokens } = useWeb3();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  if (selectedToken) {

  }

  console.log(userTokens)

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
                <HStack>
                  <InputGroup>
                    <InputLeftAddon children='Price' />
                    <Input placeholder='SOL' />
                  </InputGroup>
                  <InputGroup>
                    <InputLeftAddon children='Amount' />
                    <Input />
                  </InputGroup>
                </HStack>
                <Button width={"full"} colorScheme='orange' mr={3} onClick={onClose}>
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