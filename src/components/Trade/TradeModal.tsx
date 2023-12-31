import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftAddon,
  HStack,
  VStack,
} from '@chakra-ui/react';


import { TokenInfo } from './TokenListCard';
import { useState } from "react";
import { createBuyTransaction } from '../../smart-contract/intructions';
import { useWeb3 } from '../../stores/useWeb3';
import { PublicKey } from '@solana/web3.js';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useLoading } from '../../stores/useLoading';
import { useProgramData } from '../../stores/useProgramData';
import { getAllSellerEscrowAccountsInfo } from '../../smart-contract/accounts';

interface Props {
  isOpen: boolean,
  onClose: () => void,
  tokenInfo: TokenInfo
}

export default function TradeModal(
  {
    isOpen,
    onClose,
    tokenInfo
  }: Props
) {
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const { connection, program } = useWeb3()
  const wallet = useAnchorWallet();
  const { currEpoch } = useWeb3();
  const { setLoading } = useLoading();
  const { setAllSellEscrowInfo } = useProgramData();

  const handleBuy = async () => {
    if (program && wallet) {
      const buyIx = await createBuyTransaction(
        connection,
        program,
        new PublicKey(tokenInfo.escrowId),
        new PublicKey(tokenInfo.seller),
        wallet.publicKey,
        new PublicKey(tokenInfo.tokenAddress),
        tokenAmount,
        currEpoch
      );

      buyIx.feePayer = wallet.publicKey,
        buyIx.recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash;

      const signedTx = await wallet.signTransaction(buyIx);
      const wireTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(wireTx, { skipPreflight: true });
      setLoading(true);
      await connection.confirmTransaction(signature, "finalized");
      const dataArrSE = await getAllSellerEscrowAccountsInfo(connection);
      setAllSellEscrowInfo(dataArrSE);
      setLoading(false);
      onClose();
    }
  }

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent alignSelf={"center"}>
        <ModalHeader> Purchase Token
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack alignItems={'start'}>
            <Text>
              Token: {tokenInfo.tokenAddress}
            </Text>
            <Text>
              Total: {tokenInfo.pricePerToken * tokenAmount} SOL
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter flexDir={"row"}>
          <HStack display={"flex"} justify={"space-between"}>
            <InputGroup width={"50%"}>
              <InputLeftAddon children='Amount' />
              <Input onChange={(e) => setTokenAmount(parseInt(e.target.value))} />
            </InputGroup>
            <Flex>
              <Button colorScheme='orange' mr={3} onClick={handleBuy}>
                Buy
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </Flex>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}