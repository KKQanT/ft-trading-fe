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
import { shortenHash } from '../../utils'
import TradeModal from './TradeModal'
import { useState, useEffect } from "react";
import { useProgramData } from '../../stores/useProgramData'
import { useLoading } from '../../stores/useLoading'
import { getAllSellerEscrowAccountsInfo } from '../../smart-contract/accounts'
import { useWeb3 } from '../../stores/useWeb3'

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
  const { allSellEscrowInfo, setAllSellEscrowInfo } = useProgramData()
  const { setLoading } = useLoading();
  const {connection} = useWeb3();

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

  const handleRefresh = async () => {
    setLoading(true);
    const dataArrSE = await getAllSellerEscrowAccountsInfo(connection);
    setAllSellEscrowInfo(dataArrSE);
    setLoading(false);

  }

  return (
    <>
      <Card width={"80%"}>
        <CardHeader display={"flex"}>
          <Heading size={"md"}>
            All Token Listings
          </Heading>
          <Spacer />
          <Center >
            <RepeatIcon _hover={{
              cursor: "pointer"
            }}
              boxSize={"2rem"}
              onClick={handleRefresh}
            />
          </Center>
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