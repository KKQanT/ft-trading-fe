import { ReactNode, useEffect, useState, useMemo } from 'react'

import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
  Input,
  Button,
} from '@chakra-ui/react'
import { ReactElement } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import { EPOCH_DURATION, START_TS, getSolanaTime } from '../../utils/web3';
import * as anchor from '@project-serum/anchor';
import { FtTrading, IDL } from '../../smart-contract/program_types';
import { S3T_TRADE_PROGRAM_ID } from '../../smart-contract/program';
import { createCreateDividendVaultInstruction } from '../../smart-contract/intructions';
import { DividendVaultType, getDividendVaultInfoByEpoch } from '../../smart-contract/accounts';

interface FeatureProps {
  text: string
  iconBg: string
  icon?: ReactElement
}

const Feature = ({ text, icon, iconBg }: FeatureProps) => {
  return (
    <Stack direction={'row'} align={'center'}>
      <Flex w={8} h={8} align={'center'} justify={'center'} rounded={'full'} bg={iconBg}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{text}</Text>
    </Stack>
  )
}

export default function AdminPage() {

  const wallet = useAnchorWallet();
  const RPC = import.meta.env.VITE_REACR_APP_RPC
  const connection = useMemo(
    () => new Connection(RPC),
    []
  );
  const [program, setProgram] = useState<null | anchor.Program<anchor.Idl | FtTrading>>(
    null
  );

  const [currEpoch, setEpoch] = useState<number | null>(null);
  const [startEpoch, setStartEpoch] = useState<number>(0);
  const [endEpoch, setEndEpoch] = useState<number>(1);
  const [currentDividendVaulInfo, setCurrentDividendVaultInfo] = useState<DividendVaultType | null>(null);

  useEffect(() => {
    if ((currEpoch != null) && (connection)) {
      getDividendVaultInfoByEpoch(connection, currEpoch).then(
        (val) => {
          setCurrentDividendVaultInfo(val)
        }
      );
    }
  }, [connection, currEpoch])

  useEffect(() => {
    console.log("currentDividendVaulInfo: ", currentDividendVaulInfo)
  }, [currentDividendVaulInfo])

  useEffect(() => {
    getSolanaTime(connection)
      .then((solanaTime) => {
        console.log('solanaTime: ', solanaTime)
        const epoch = Math.floor((solanaTime! - START_TS) / EPOCH_DURATION);
        setEpoch(epoch);
      })
  }, [])

  useEffect(() => {
    if (wallet?.publicKey) {
      const provider = new anchor.AnchorProvider(
        connection,
        wallet as anchor.Wallet,
        {}
      );
      anchor.setProvider(provider);

      const program = new anchor.Program(
        IDL as anchor.Idl,
        S3T_TRADE_PROGRAM_ID
      );
      setProgram(program);
    }
  }, [wallet?.publicKey]);

  const handleCreateVault = async () => {
    console.log("start: ", startEpoch);
    console.log("stop: ", endEpoch);
    if (program && wallet) {
      const allTransactions = []
      for (let epoch = startEpoch; epoch <= endEpoch; epoch++) {
        const transaction = new Transaction();
        const ix = await createCreateDividendVaultInstruction(
          program,
          epoch,
          wallet?.publicKey
        );
        transaction.add(ix)
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
        allTransactions.push(transaction);
      }
      const allSignedTransactions = await wallet.signAllTransactions?.(allTransactions);
      for (const signedTx of allSignedTransactions) {
        const wireTx = signedTx.serialize();
        const signature = await connection.sendRawTransaction(wireTx, { skipPreflight: true });
        console.log(signature);
      }
    }
  }

  const handleSetEpoch = (
    event: React.ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    event.preventDefault();
    const value = event.target.value;
    const inputEpoch = parseInt(value);
    setValue(inputEpoch);
  }

  return (
    <Container maxW={'5xl'} py={12}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        <Stack spacing={4}>
          <Heading>Program Status</Heading>
          <Stack
            spacing={4}
            divider={
              <StackDivider borderColor={useColorModeValue('gray.100', 'gray.700')} />
            }>
            <Feature
              iconBg={useColorModeValue('yellow.100', 'yellow.900')}
              text={'Current Epoch: ' + currEpoch}
            />
            <Feature
              iconBg={useColorModeValue('green.100', 'green.900')}
              text={'Financial Planning'}
            />
            <Feature
              iconBg={useColorModeValue('purple.100', 'purple.900')}
              text={'Market Analysis'}
            />
          </Stack>
        </Stack>
        <Flex
          align={'center'}
          justify={'center'}
          py={12}
          bg={useColorModeValue('gray.50', 'gray.800')}>

          <Stack
            boxShadow={'2xl'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            p={10}
            spacing={8}
            align={'center'}>
            <Stack align={'center'} spacing={2}>
              <Heading
                textTransform={'uppercase'}
                fontSize={'3xl'}
                color={useColorModeValue('gray.800', 'gray.200')}>
                Admin Panel
              </Heading>
              <Text fontSize={'lg'} color={'gray.500'}>
              </Text>
            </Stack>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
              <Input
                type={'text'}
                placeholder={'start'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }}
                onChange={(e) => handleSetEpoch(e, setStartEpoch)}
              />
              <Input
                type={'text'}
                placeholder={'stop'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }}
                onChange={(e) => handleSetEpoch(e, setEndEpoch)}
              />
              <Button
                bg={'blue.400'}
                rounded={'full'}
                color={'white'}
                flex={'1 0 auto'}
                _hover={{ bg: 'blue.500' }}
                _focus={{ bg: 'blue.500' }}
                onClick={handleCreateVault}
              >
                Create Dividend
              </Button>

            </Stack>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
              <Input
                type={'text'}
                placeholder={'token address'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'full'}
                border={0}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }}
              />
              <Button
                bg={'blue.400'}
                rounded={'full'}
                color={'white'}
                flex={'1 0 auto'}
                _hover={{ bg: 'blue.500' }}
                _focus={{ bg: 'blue.500' }}>
                Whitelist NFT
              </Button>

            </Stack>
          </Stack>
        </Flex>

      </SimpleGrid>
    </Container>
  )
}