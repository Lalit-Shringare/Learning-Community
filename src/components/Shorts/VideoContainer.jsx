import { Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from 'react-router-dom';
import Reel from "./Reel"
import { useEffect, useState } from "react";
import './Shorts.css';
export default function VideoContainer({ followers, isLoading, }) {
  
  

  
  return (
    <Flex w="100%" h="100vh" justifyContent={'center'} alignItems={'center'}>
        <Reel followers={followers} isLoading= {isLoading}/>

    </Flex>
    
  )
}
