import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import Message from "../Message/Message";
import CreateReel from "../Shorts/CreateReel"
import Reel from "../Shorts/Reel"
import { CreatePostLogo } from "../../assets/constants";
import VideoIcon from "../../assets/constants";
import { 
	Button, 
	Popover, 
	PopoverTrigger, 
	PopoverContent, 
	PopoverBody, 
	PopoverCloseButton, 
	Box ,
	Tooltip,
	Flex,
  } from '@chakra-ui/react';
import { Link } from "react-router-dom";

const SidebarItems = ({totalUnreadCount}) => {
  // console.log(totalUnreadCount);
	return (
		<>
			<Home />
			<Search />
			<Notifications />
			<Message totalUnreadCount={totalUnreadCount}/>
			<Choose />
			<ReelTrigger/>
			<ProfileLink />
		</>
	);
};
const Choose = () => {
	return(
		<Box>
      <Popover>
        <PopoverTrigger>
          <Button fontWeight={'400'} color={'black'} gap={4}  paddingInlineStart={2}>
            <CreatePostLogo />
              <Box display={{ base: "none", md: "block" }}>Cretae</Box>
            </Button>
        </PopoverTrigger>
        <PopoverContent zIndex="popover" w={'100%'} marginInlineStart={'5%'} bg={'white'} border={'1px dotted black'} borderRadius={'1rem'}>
          
          <PopoverCloseButton />
          <PopoverBody>
            <Button _hover={{bg:'gray.100'}} bg={'gray.200'} color={'black'} w="100%" mb={2}>{<CreatePost/>}</Button>
            <Button _hover={{bg:'gray.100'}} bg={'gray.200'} color={'black'} w="100%" mb={2}>{<CreateReel/>}</Button>
            
          </PopoverBody>
          
        </PopoverContent>
      </Popover>
    </Box>
	
	)
};
const ReelTrigger = () =>{
	return(
		<Tooltip
        hasArrow
        label={"Create"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
	  <Link to={'/vid/vid'} >
        <Flex
          alignItems="center"
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          
        >
          <VideoIcon/>
          <Box display={{ base: "none", md: "block" }}>Clips</Box>
        </Flex>
		</Link>
      </Tooltip>

	)
} 


export default SidebarItems;
