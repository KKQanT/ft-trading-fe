'use client'

import {
  Stack,
  Heading,
  Text,
  Input,
  Button,
  Image,
  Box,
  FormControl,
  FormLabel,
  Center,
  Container,

} from '@chakra-ui/react'

import { Card, CardBody } from '@chakra-ui/react'


import { SimpleGrid } from '@chakra-ui/react';
import {  Keypair } from '@solana/web3.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { createMintTokenTransaction } from '../../utils/web3';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import shortenHash from '../../utils';
import { useWeb3 } from '../../stores/useWeb3';

export default function TokenService() {

  const [tokenKeypairRaw, setTokenKeypairRaw] = useState<number[]>([]);
  const [tokenKeypair, setTokenKeypair] = useState<Keypair | null>(null);
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [metadataUri, setMetadataUri] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [tokenImageUri, setTokenImageUri] = useState<string>('solana-sol-logo-12828AD23D-seeklogo.com.png');
  const [signature, setSignature] = useState<string>("");

  const {connection} = useWeb3();

  const wallet = useAnchorWallet();

  useEffect(() => {
    if (tokenKeypairRaw.length > 0) {
      const keypair = Keypair.fromSecretKey(
        Uint8Array.from(tokenKeypairRaw)
      );
      setTokenKeypair(keypair);
    }
  }, [tokenKeypairRaw]);

  const onChangeKeypair = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value;
    const parsedArray = JSON.parse(value);
    if (Array.isArray(parsedArray)) {
      setTokenKeypairRaw(parsedArray);
    }
  }

  const onClickGenerateKeypair = () => {
    const keypair = new Keypair();
    setTokenKeypair(keypair);
  }

  useEffect(() => {

    axios.get(metadataUri).then((resp) => {
      const imageUri = resp.data.image
      setTokenImageUri(imageUri);
    }).catch((err) => { console.log(err) })

  }, [metadataUri])

  const handleMint = async () => {
    if (wallet?.publicKey && tokenKeypair) {
      const mintIx = await createMintTokenTransaction(
        connection,
        wallet.publicKey,
        tokenKeypair,
        amount,
        metadataUri,
        tokenName,
        tokenSymbol
      );

      mintIx.feePayer = wallet.publicKey;
      mintIx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
      mintIx.partialSign(tokenKeypair);
      const signedTx = await wallet.signTransaction(mintIx);
      const wireTx = signedTx.serialize();
      const mintSignature = await connection.sendRawTransaction(wireTx, { skipPreflight: true });
      setSignature(mintSignature);

    }
  }

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
        <SimpleGrid columns={2} spacing={10} width={"xl"} alignSelf={"center"}>

          <Card maxW='sm' bg={'transparent'}>
            <CardBody>
              <Center>
                <Image
                  src={tokenImageUri}
                  alt='Green double couch with wooden legs'
                  borderRadius='lg'
                  height={"2xs"}
                />
              </Center>
              <Stack mt='6' spacing='3'>
                <Heading size='md'>{`${tokenName} ${tokenSymbol}`}</Heading>
                <Text alignSelf={"self-start"}>
                  Token Address : {
                    tokenKeypair?.publicKey.toBase58() ?
                      shortenHash(tokenKeypair?.publicKey.toBase58()) :
                      ""}
                </Text>
                <Text alignSelf={"self-start"}>
                  Signature : {signature.length > 0  ? shortenHash(signature) : ""}
                </Text>
              </Stack>
            </CardBody>

          </Card>

          <Stack spacing={4}>

            <FormControl>
              <FormLabel>Token Keypair</FormLabel>
              <Input type="text" onChange={onChangeKeypair} />
            </FormControl>
            <Button
              bg={'gray.800'}
              color={'white'}
              _hover={{
                bg: 'gray.500',
              }}
              onClick={onClickGenerateKeypair}
            >
              Generate
            </Button>

            <FormControl>
              <FormLabel>Token Name</FormLabel>
              <Input type="text" onChange={(e) => setTokenName(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Token Symbol</FormLabel>
              <Input type="text" onChange={(e) => setTokenSymbol(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Metadata URI</FormLabel>
              <Input type="text" onChange={(e) => setMetadataUri(e.target.value)} />
            </FormControl>

            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input type="number" onChange={(e) => setAmount(parseInt(e.target.value))} />
            </FormControl>

            <Button
              bg={'orange.400'}
              color={'white'}
              _hover={{
                bg: 'orange.500',
              }}
              onClick={handleMint}
              >
              Mint
            </Button>

          </Stack>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
