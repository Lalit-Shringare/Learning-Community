import { Flex } from "@chakra-ui/react";
import Reel from "./Reel"
import './Shorts.css';
export default function VideoContainer() {
  return (
    <Flex w="100%" h="100vh" bg={'blue.100'} justifyContent={'center'} alignItems={'center'}>
        <Reel/>

    </Flex>
    
  )
}
