'use client'

import {
  Flex,
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Icon,
  useColorModeValue,
  createIcon,
  Image,
  Box,
  FormControl,
  FormLabel,
  Checkbox,
  ButtonGroup,
  Divider,
  Center,
  Container,

} from '@chakra-ui/react'

import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'


import { SimpleGrid } from '@chakra-ui/react';

export default function TokenService() {
  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          TOKEN{' '}
          <Text as={'span'} color={'orange.400'}>
            SERVICE
          </Text>
        </Heading>
        <SimpleGrid columns={2} spacing={10} width={"xl"}  alignSelf={"center"}>

          <Card maxW='sm' bg={'transparent'}>
            <CardBody>
              <Center>
                <Image
                  src='https://arweave.net/aCDlkArxcY137kRSk6Y5TRVwudQb3qiPwickKTywxUk?ext=png'
                  alt='Green double couch with wooden legs'
                  borderRadius='lg'
                  height={"2xs"}
                />
              </Center>
              <Stack mt='6' spacing='3'>
                <Heading size='md'>S3T Trade Stock (S3T)</Heading>
                <Text>
                  Token Address : {"xgCX33XmVLqdXbYJv5FFXUFRxdzPBCk34SGZWhzdbLr"}
                </Text>
              </Stack>
            </CardBody>

          </Card>

          <Stack spacing={4}>

            <FormControl>
              <FormLabel>Token Keypair</FormLabel>
              <Input type="text" />
            </FormControl>
            <Button
              bg={'orange.400'}
              color={'white'}
              _hover={{
                bg: 'orange.500',
              }}>
              Generate
            </Button>

            <FormControl>
              <FormLabel>Token Name</FormLabel>
              <Input type="text" />
            </FormControl>

            <FormControl>
              <FormLabel>Token Symbol</FormLabel>
              <Input type="text" />
            </FormControl>

            <FormControl>
              <FormLabel>Metadata URI</FormLabel>
              <Input type="text" />
            </FormControl>

            <Button
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}>
              Mint
            </Button>

          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
