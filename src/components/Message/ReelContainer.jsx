import { Modal, ModalOverlay,ModalContent, ModalHeader, ModalCloseButton, ModalBody } from "@chakra-ui/react"
import VideoIcon from "../../assets/constants"
import { Flex, Box } from "@chakra-ui/react"
import ReactPlayer from "react-player"
export default function ReelContainer({isOpen, onClose, url}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent bg={"white"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
      <ModalHeader>
      <Flex gap={'0.7rem'} alignItems={'center'}>
            <VideoIcon/> <p>Clips</p>
      </Flex>
        
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
            <Box w="100%" borderRadius="md" overflow="hidden" mt={2} mb={2}>
                <ReactPlayer 
                    loop
                    width="100%" 
                    height={'60%'}
                    url={url}
                    playing
                    style={{ borderRadius: "10px" }}
                />
            </Box>
      </ModalBody>
    </ModalContent>
  </Modal>
  )
}
