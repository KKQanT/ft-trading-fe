import { Button, Center, Checkbox, Link, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, UnorderedList, VStack } from "@chakra-ui/react"

interface Props {
  isOpen: boolean,
  onClose: () => void,
}

import { useNavigate } from "react-router-dom";
import { useState } from "react";

const NewUserModal = ({
  isOpen,
  onClose,
}: Props) => {
  const navigate = useNavigate();
  const handleHideNewUserModal = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setIsChecked(event.target.checked);
    localStorage.setItem("hideNewUserModal", event.target.checked.toString());
  };
  const [checked, setIsChecked] = useState<boolean>(false);

  return (
    <>
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hold Up!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} bg=''>
            <Text mb="1rem">
              This platform is still in development and the on-chain program is still on devnet. If you wish to test out this platform please...
            </Text>
            <UnorderedList mb="1rem" px="1rem">
              <ListItem>
                {"Ensure you have your own custodial wallet extension, such as "}
                <Link color={"orange.500"} href="https://phantom.app/">Phantom wallet</Link>
              </ListItem>
              <ListItem>Switch your network on Phantom to "testnet"</ListItem>
              <ListItem>{"Acquire SOL on the devnet by using "}
              <Link color={"orange.500"} href="https://solfaucet.com/">solfaucet</Link>
              </ListItem>
              <ListItem>
                {"If you want to try out tokens selling, you can mint your own token via "}
                <Link
                  color={"orange.500"}
                  onClick={() => { navigate('/token-service'); onClose() }}
                >
                  Token Service
                </Link>
              </ListItem>
              <ListItem>
                {"Since I haven't implemented Share Holder NFT minting yet, if you want to try out invester-claim-dividend features you can contract me directly for platforms NFT via "}
                <Link color={"orange.500"} href="https://www.linkedin.com/in/peerakarn/">Linkedin</Link>
              </ListItem>
            </UnorderedList>
            <VStack width={"100%"} bg=''>
              <Checkbox
              colorScheme="orange"
              isChecked={checked}
              onChange={handleHideNewUserModal}
              >
                Don't show message again
              </Checkbox>
              <Center width={"100%"}>
                <Button colorScheme="orange" onClick={onClose}>GOT IT!</Button>
              </Center>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default NewUserModal