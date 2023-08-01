import {
  Heading,
  Stack,
  Text,
  Box,
  StackDivider,
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
} from '@chakra-ui/react'

import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import shortenHash from '../../utils'

interface AggregratedTokenDataProps {
  image: string,
  name: string,
  address: string,
  qty: number,
  floor: number
}

const AggregratedTokenData: AggregratedTokenDataProps[] = [
  {
    image: "https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    name: "bonk",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    qty: 10,
    floor: 0.0001

  },
  {
    image: "https://gateway.pinata.cloud/ipfs/Qmb5qNLPhR8fJaz5MN1W55iSCXdNgMMSdWn94Z9oiFjw3o",
    name: "dust",
    address: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
    qty: 20,
    floor: 0.01

  },
  {
    image: "https://raw.githubusercontent.com/puppetmonkester/img-repo/main/logo.png",
    name: "ata",
    address: "9cyEStsrZF7LzqLzbNcuUeuat1NM4eHrBVApvkPBCQk4",
    qty: 30,
    floor: 0.1

  }
]

const TokenListCard = () => {
  return (
    <Card width={"80%"}>
      <CardHeader display={"flex"}>
        <Heading size={"md"}>
          All Token Listings
        </Heading>
        <Spacer />
        <Center ><RepeatIcon /></Center>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant={"striped"} colorScheme={"facebook"}>
            <Thead>
              <Tr>
                <Th>Token Name</Th>
                <Th>address</Th>
                <Th isNumeric>qty</Th>
                <Th isNumeric>floor</Th>
                <Th> </Th>
              </Tr>
            </Thead>
            <Tbody>
              {AggregratedTokenData.map((item) => (
                <Tr>
                  <Td>{item.name}</Td>
                  <Td>{shortenHash(item.address)}</Td>
                  <Td isNumeric>{item.qty}</Td>
                  <Td isNumeric>{item.floor}</Td>
                  <Td ><Button>Buy</Button></Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )

}

export default TokenListCard