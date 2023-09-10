import {
  Heading,
  Stack,
  Text,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import ListTokenModal from './ListTokenModal';
import { useNavigate } from "react-router-dom";

const TradePageHeader = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <ListTokenModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      <Heading
        fontWeight={600}
        fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
        lineHeight={'110%'}>
        S3T TRADE{' '}
        <Text as={'span'} color={'orange.400'}>
          MARKET PLACE
        </Text>
      </Heading>
      <Text maxW={'3xl'}>
        We charge buyers a 10% fee. Rest assured, all fees contribute to our central treasury account, where they are distributed among our valued shareholders.
        <br /><br />
        Join us now to enjoy guaranteed benefits as a S3T Trade shareholder! </Text>
      <Stack spacing={6} direction={'row'}>
        <Button
          px={6}
          colorScheme={'orange'}
          bg={'orange.400'}
          _hover={{ bg: 'orange.500' }}
          onClick={onOpen}
        >
          List Your Token
        </Button>
        <Button
          px={6}
          onClick={() => navigate('/token-service')}
          color={"orange.400"}
          bg={'white'}
          _hover={{
            bg: 'gray.400',
          }}
        >
          Create Your Token
        </Button>
      </Stack>
    </>
  )
}


export default TradePageHeader