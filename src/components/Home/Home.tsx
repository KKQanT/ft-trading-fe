import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
} from '@chakra-ui/react'

export default function Home() {
  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
            lineHeight={'110%'}>
            Welcome to  <br />
            <Text as={'span'} color={'orange.400'}>
              Solana Stock Trading Platform
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Monetize your content by charging your most loyal readers and reward them
            loyalty points. Give back to your loyal readers by granting them access to
            your pre-releases and sneak-peaks.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'green'}
              bg={'orange.400'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'orange.600',
              }}>
              Trade
            </Button>
            <Button variant={'link'} colorScheme={'blue'} size={'sm'}>
              Investor
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}