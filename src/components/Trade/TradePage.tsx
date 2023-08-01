import {
  Container,
  Stack,
} from '@chakra-ui/react'

import TradePageHeader from './Header'
import TokenListCard from './TokenListCard'

export default function TradingPage() {
  return (
    <Container maxW={'5xl'}>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <TradePageHeader/>
        <TokenListCard/>
      </Stack>
    </Container>
  )
}