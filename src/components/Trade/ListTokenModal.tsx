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
  SimpleGrid,
  Center,

} from '@chakra-ui/react'

import { useWeb3 } from '../../stores/useWeb3';
import { useEffect, useState } from "react";
import { createSellTransaction } from '../../smart-contract/intructions';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useProgramData } from '../../stores/useProgramData';
import { getAllSellerEscrowAccountsInfo } from '../../smart-contract/accounts';
import { useLoading } from '../../stores/useLoading';
import TokenCard from './TokenCard';

interface PropType {
  isOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
}

function ListTokenModal(
  { isOpen, onClose }: PropType
) {
  const { userTokens, connection, program } = useWeb3();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const wallet = useAnchorWallet();
  const { setAllSellEscrowInfo } = useProgramData();
  const { setLoading } = useLoading();
  const [nftTokenAddressesToSell, setNftTokenAddressesToSell] = useState<string[]>([])

  const handleListToken = async () => {
    if (program && connection && wallet?.publicKey && selectedToken) {
      const transactions = await Promise.all(nftTokenAddressesToSell.map(async (tokenAddress) => {
        const transaction = await createSellTransaction(
          connection,
          program,
          wallet?.publicKey,
          new PublicKey(tokenAddress),
          1,
          price * LAMPORTS_PER_SOL
        );
      }))
      const transaction = await createSellTransaction(
        connection,
        program,
        wallet?.publicKey,
        new PublicKey(selectedToken),
        tokenAmount,
        price * LAMPORTS_PER_SOL
      );
    }
  }

  const handleSell = async () => {
    if (program && connection && wallet?.publicKey && selectedToken) {

      const transaction = await createSellTransaction(
        connection,
        program,
        wallet?.publicKey,
        new PublicKey(selectedToken),
        tokenAmount,
        price * LAMPORTS_PER_SOL
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;

      const signedTx = await wallet.signTransaction(transaction);
      const wireTx = signedTx.serialize();
      const signature = await connection.sendRawTransaction(wireTx, { skipPreflight: true });
      console.log(signature);
      setLoading(true);
      await connection.confirmTransaction(signature, "finalized");
      const dataArrSE = await getAllSellerEscrowAccountsInfo(connection);
      setAllSellEscrowInfo(dataArrSE);
      setLoading(false);
      onClose();

    }

  }

  const handleSelect = (tokenAddress: string) => {
    let nftTokenAddressesToSell_ = [...nftTokenAddressesToSell];
    if (nftTokenAddressesToSell_.includes(tokenAddress)) {
      nftTokenAddressesToSell_ = nftTokenAddressesToSell_.filter(
        item => item !== tokenAddress
      );
    } else {
      nftTokenAddressesToSell_.push(tokenAddress);
    }
    setNftTokenAddressesToSell([...nftTokenAddressesToSell_])
  }

  useEffect(() => {
    console.log(nftTokenAddressesToSell)
  }, [nftTokenAddressesToSell])

  return (
    <>
      <Modal isOpen={isOpen} onClose={
        () => {
          onClose();
          setNftTokenAddressesToSell([])
        }
      }>
        <ModalOverlay />
        <ModalContent
          alignSelf={"center"}
          maxWidth={"512px"}
          color={"white"}
          bg={"black"}
          borderColor={"white"}
          border={"1px"}
        >
          <ModalHeader>
            <Text >
              List your tokens for sell
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid
              minChildWidth="128px"
              spacing="28px"
              alignItems="center"
              justifyContent="center"
              overflowY={"scroll"}
              maxHeight={"512px"}
            >
              {userTokens.map((item) => {
                return (
                  <TokenCard
                    tokenObj={item}
                    handleOnClick={() => { handleSelect(item.tokenAddress) }}
                  />
                )
              })}

            </SimpleGrid>
          </ModalBody>
          <ModalFooter>

            < Center width={"100%"}>
              <Button
                width={"25%"}
                isDisabled={nftTokenAddressesToSell.length === 0}
                onClick={() => { }}>
                NEXT
              </Button>
            </Center>

          </ModalFooter>
        </ModalContent>
      </Modal >
    </>
  )
}

export default ListTokenModal;