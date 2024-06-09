import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Link,
} from '@chakra-ui/react'

import { useNavigate } from "react-router-dom";
import Mechanics from './Mechanics';
import { Fade } from 'react-awesome-reveal';

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Fade>
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
              lineHeight={'110%'}>
              Welcome to  <br />
              <Text as={'span'} color={'orange.400'}>
                Solana Stock Trading Platform
              </Text>
            </Heading>
          </Fade>
          <Fade>
            <Text>
              Welcome to S3T Trade, where safe token trading is our priority! Buy, sell, and trade NFTs/FTs securely on our platform. Hold our NFTs to become a shareholder and receive real-time dividend shares in SOL from platform income. Join us now for the future of digital asset trading!
              <br />
              {"All transactions are transaparante on chains: "}
              <Link color={"orange.500"} href='https://solscan.io/account/S3TX6wejVn7n9d7CPtLySdBaaTgu8RdMCByrCDpEkR4?cluster=devnet'>S3TX6wejVn7n9d7CPtLySdBaaTgu8RdMCByrCDpEkR4
              </Link>
            </Text>
          </Fade>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Fade>
              <Button
                width={"100px"}
                colorScheme={'green'}
                bg={'orange.400'}
                px={6}
                _hover={{
                  bg: 'orange.600',
                }}
                onClick={() => { navigate('/trade') }}
              >
                Trade
              </Button>
              <Button
               color={"orange.400"} 
               width={"100px"} 
               onClick={() => { navigate('/investor') }}
               bg={'white'}
               _hover={{
                bg: 'gray.400',
              }}
               >
                Invest
              </Button>
            </Fade>
          </Stack>
          <Mechanics />
        </Stack>
      </Container>
    </>
  )
}