import {
  Heading,
  Center,
  Spacer,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  useDisclosure,
} from '@chakra-ui/react'

import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'

const RewardList = () => {
  return (
    <TableContainer>
      <Table variant={"striped"} colorScheme={"orange"}>
        <Thead>
          <Tr>
            <Th isNumeric>Epoch</Th>
            <Th>address</Th>
            <Th isNumeric>your share</Th>
            <Th isNumeric>total share</Th>
            <Th isNumeric>Profit Amount (Sol)</Th>
            <Th isNumeric>Dividend (Sol)</Th>
            <Th> </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>1</Td>
            <Td>xsfs...sdfs</Td>
            <Td isNumeric>200</Td>
            <Td isNumeric>10000</Td>
            <Td isNumeric>1.2</Td>
            <Td isNumeric>7</Td>
            <Td ><Button>Claim</Button></Td>
          </Tr>
          <Tr>
            <Td>2</Td>
            <Td>xsfs...sdfs</Td>
            <Td isNumeric>200</Td>
            <Td isNumeric>10000</Td>
            <Td isNumeric>1.2</Td>
            <Td isNumeric>7</Td>
            <Td ><Button disabled>Claimed</Button></Td>
          </Tr>
          <Tr>
            <Td>3</Td>
            <Td>xsfs...sdfs</Td>
            <Td isNumeric>200</Td>
            <Td isNumeric>10000</Td>
            <Td isNumeric>1.2</Td>
            <Td isNumeric>7</Td>
            <Td ><Button disabled>Claimed</Button></Td>
          </Tr>

        </Tbody>
      </Table>
    </TableContainer>
  )
}

export default RewardList;