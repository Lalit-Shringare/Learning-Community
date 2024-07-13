import { Box, Flex, Center, Text, IconButton } from "@chakra-ui/react";
import { FaPlay, FaPause, FaHeart, FaShare } from "react-icons/fa";
import { useEffect, useRef } from "react";

function Reel() {
    const videoRef = useRef(null);
    useEffect(() => {
        const videoElement = videoRef.current;
        videoElement.addEventListener("click", handleVideoClick);
    
        return () => {
          videoElement.removeEventListener("click", handleVideoClick);
        };
      }, []);
    
      const handleVideoClick = () => {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      };
  return (
    <Box w="30%" h="98%" bg="gray.800" borderRadius={'10px'} justifyContent={'center'} alignItems={'center'}>
      <video
       ref={videoRef}
        width="100%"
        height="100%"
        controls = {false}
        style={{ objectFit: "cover", borderRadius: "10px", height:'100%' }}
      >
        <source src="./vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
     
    </Box>
  );
}

export default Reel;

