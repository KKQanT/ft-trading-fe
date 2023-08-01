import {
  Heading,
  Stack,
  Text,
  Button,
} from '@chakra-ui/react'

const TradePageHeader = () => {
  return (
    <>
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
        lineHeight={'110%'}>
        S3T TRADE{' '}
        <Text as={'span'} color={'orange.400'}>
          MARKET PLACE
        </Text>
      </Heading>
      <Text color={'gray.500'} maxW={'3xl'}>
        Never miss a meeting. Never be late for one too. Keep track of your meetings and
        receive smart reminders in appropriate times. Read your smart “Daily Agenda”
        every morning.
      </Text>
      <Stack spacing={6} direction={'row'}>
        <Button
          rounded={'full'}
          px={6}
          colorScheme={'orange'}
          bg={'orange.400'}
          _hover={{ bg: 'orange.500' }}>
          List Your Token
        </Button>
        <Button rounded={'full'} px={6}>
          Create Your Token
        </Button>
      </Stack>
    </>
  )
}

export default TradePageHeader