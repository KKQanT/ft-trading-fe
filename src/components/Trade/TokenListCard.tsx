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
import shortenHash from '../../utils'
import TradeModal from './TradeModal'
import { useState, useEffect } from "react";
import { useProgramData } from '../../stores/useProgramData'

interface AggregratedTokenDataProps {
  image: string,
  name: string,
  address: string,
  qty: number,
  avgPrice: number
}

const AggregratedTokenData: AggregratedTokenDataProps[] = [
  {
    image: "https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
    name: "bonk",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    qty: 10,
    avgPrice: 0.0001

  },
  {
    image: "https://gateway.pinata.cloud/ipfs/Qmb5qNLPhR8fJaz5MN1W55iSCXdNgMMSdWn94Z9oiFjw3o",
    name: "dust",
    address: "DUSTawucrTsGU8hcqRdHDCbuYhCPADMLM2VcCb8VnFnQ",
    qty: 20,
    avgPrice: 0.01

  },
  {
    image: "https://raw.githubusercontent.com/puppetmonkester/img-repo/main/logo.png",
    name: "ata",
    address: "9cyEStsrZF7LzqLzbNcuUeuat1NM4eHrBVApvkPBCQk4",
    qty: 30,
    avgPrice: 0.1

  }
]

export interface TokenInfo {
  tokenAddress: string,
  pricePerToken: number,
  escrowId: string,
  seller: string
}

const TokenListCard = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedToken, setToken] = useState<TokenInfo>({
    tokenAddress: "",
    pricePerToken: 0,
    escrowId: "",
    seller: ""
  });
  const [tokenHasSet, setTokenHasSet] = useState<boolean>(false);
  const { allSellEscrowInfo } = useProgramData()

  const openTrade = (
    tokenAddress: string,
    pricePerToken: number,
    escrowId: string,
    seller: string
  ) => {
    onOpen()
    setToken({
      tokenAddress: tokenAddress,
      pricePerToken: pricePerToken,
      escrowId: escrowId,
      seller: seller
    })
  }

  useEffect(() => {
    if (selectedToken) {
      setTokenHasSet(true)

    }
  }, [selectedToken])

  return (
    <>
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
            <Table variant={"striped"} colorScheme={"orange"}>
              <Thead>
                <Tr>
                  <Th>address</Th>
                  <Th isNumeric>qty</Th>
                  <Th isNumeric>price (sol/token)</Th>
                  <Th> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {allSellEscrowInfo.map((item) => (
                  <Tr key={item.escrowId}>
                    <Td>{shortenHash(item.tokenAddress)}</Td>
                    <Td isNumeric>{item.amount}</Td>
                    <Td isNumeric>{item.pricePerToken}</Td>
                    <Td>
                      <Button
                        alignSelf={"end"}
                        onClick={
                          () =>
                            openTrade(
                              item.tokenAddress,
                              item.pricePerToken,
                              item.escrowId,
                              item.seller
                            )
                        }>
                        Trade
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
      <TradeModal
        isOpen={isOpen && tokenHasSet}
        onClose={onClose}
        tokenInfo={selectedToken!}
      />
    </>
  )

}

export default TokenListCard