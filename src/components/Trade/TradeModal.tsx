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
  Input,
  Flex,
  Spacer
} from '@chakra-ui/react';

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

import { TokenInfo } from './TokenListCard';

interface Props {
  isOpen: boolean,
  onClose: () => void,
  tokenInfo: TokenInfo
}

export default function TradeModal(
  {
    isOpen,
    onClose,
    tokenInfo
  }: Props
) {
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {tokenInfo.name} <br />
          <Text fontSize={"sm"}>{tokenInfo.tokenAddress}</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>

          <TableContainer>
            <Table variant='striped' colorScheme='teal' size='sm'>
              <Thead>
                <Tr>
                  <Th>To convert</Th>
                  <Th>into</Th>
                  <Th isNumeric>multiply by</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td isNumeric>25.4</Td>
                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>centimetres (cm)</Td>
                  <Td isNumeric>30.48</Td>
                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td isNumeric>0.91444</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

        </ModalBody>
        <ModalFooter flexDir={"row"}>
          <Input 
          htmlSize={4} 
          width='auto'
          placeholder='Amount' 
          />
          <Spacer></Spacer>
          <Flex>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}