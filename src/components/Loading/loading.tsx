import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react'

import { useLoading } from '../../stores/useLoading'

function Loading() {
  const { isLoading } = useLoading();
  return (
    <>
      <Modal isOpen={isLoading} onClose={() => { }}>
        <ModalOverlay/>
        <ModalContent bg={'transparent'} alignSelf={"center"}>
          <Spinner  alignSelf={"center"} size={"xl"} color='orange.500' thickness='5px'/>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Loading