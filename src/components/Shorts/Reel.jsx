import { useEffect, useState, useCallback } from "react";
import ReactPlayer from "react-player";
import { Box, Flex, Center, Spinner, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverBody, Text } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { firestore } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { CommentReel, MenuThreeDot, SaveLogo, ShareButton, UnlikeLogoReel } from "../../assets/constants";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import useAuthStore from "../../store/authStore";
import useShowToast from "../../hooks/useShowToast";
import { CommentModal } from "./CommentModal";
import ReelBottom from "./ReelBottom";
import FollowerList from "../Profile/FollowerList";
import useUserProfileStore from "../../store/userProfileStore";
import { Profile } from "../Message/Profile";
import { ShareProfiles } from "./shareProfiles";

function Reel({ followers, isLoading, }) {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [scrollDirection, setScrollDirection] = useState(null);

  
  const [startTouchY, setStartTouchY] = useState(null);
  
  const {isOpen: isFOpen,onOpen: onFOpen,onClose: onFClose,} = useDisclosure();

  const authUser = useAuthStore((state) => state.user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();

  const fetchVideos = useCallback(async () => {
    const startTime = performance.now(); // Start time

    try {
      const q = query(
        collection(firestore, 'reels'),
        orderBy('createdBy', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const videoData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVideos(videoData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos: ', error);
      setLoading(false);
    } finally {
      const endTime = performance.now(); // End time
      const fetchTime = endTime - startTime; // Time taken in milliseconds
      console.log(`Time taken to fetch videos: ${fetchTime} ms`);
    }
  }, []);

  

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    if (videos.length && authUser) {
      const currentVideo = videos[currentVideoIndex];
      const isLikedByCurrentUser = currentVideo.likes?.includes(authUser.uid);
      setIsLiked(isLikedByCurrentUser);
      setLikes(currentVideo.likes?.length || 0);
    }
  }, [currentVideoIndex, videos, authUser]);

  const currentVideo = videos[currentVideoIndex];

  const handleLike = async () => {
    if (isUpdating) return;
    if (!authUser) return showToast("Error", "You must be logged in to like a post", "error");
    setIsUpdating(true);

    try {
      const postRef = doc(firestore, "reels", currentVideo.id);
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(authUser.uid) : arrayUnion(authUser.uid),
      });

      setIsLiked(!isLiked);
      isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsUpdating(false);
    }
  }

  const handleVideoReady = () => {
    setVideoLoading(false);
  };

  // const handleScroll = (direction) => {
  //   setScrollDirection(direction);
  //   setVideoLoading(true);
  //   setTimeout(() => {
  //     setCurrentVideoIndex(prevIndex => {
  //       if (direction === 'up') {
  //         return (prevIndex - 1 + videos.length) % videos.length;
  //       } else {
  //         return (prevIndex + 1) % videos.length;
  //       }
  //     });
  //     setScrollDirection(null);
  //   }, 500);
  // };
  const handleScroll = (direction) => {
    if (scrollDirection) return; // Prevent scrolling while already scrolling

    setScrollDirection(direction);
    setVideoLoading(true);

    setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => {
        if (direction === 'up') {
          return (prevIndex - 1 + videos.length) % videos.length;
        } else {
          return (prevIndex + 1) % videos.length;
        }
      });

      setScrollDirection(null);
    }, 500); // Adjust the timeout duration as needed
  };

  const handleClick = () => {
    setPlaying(prevPlaying => !prevPlaying);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      handleScroll('up');
    } else if (event.deltaY > 0) {
      handleScroll('down');
    }
  };

  const handleShare = () => {
    console.log('Share');
    onFOpen();
  };

  if (loading) {
    return (
      <Center h="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!videos.length) {
    return (
      <Center h="100%">
        <p>No videos available</p>
      </Center>
    );
  }
  

  return (
    <>
      <Box w="100%" h="100%" bg="transparent" borderRadius="10px" position="relative" overflow="hidden">
        {videoLoading && (
          <Center h="100%" position="absolute" top="0" left="0" right="0" bottom="0" zIndex="1">
            <Spinner size="xl" />
          </Center>
        )}
        <Box className={scrollDirection ? `slide-${scrollDirection}` : ''} h="100%" display="flex" alignItems="center" justifyContent="center">
          <Box w="30%" h="92%" borderRadius="10px" overflow="hidden" bg={'gray.200'} position="relative">
            <ReactPlayer
              url={currentVideo?.videoURL}
              playing={playing}
              loop
              width="100%"
              height="100%"
              onReady={handleVideoReady}
              onClick={handleClick}
              onBuffer={() => setVideoLoading(true)}
              onBufferEnd={() => setVideoLoading(false)}
              style={{ borderRadius: "10px" }}
            />
            <Box position="absolute" bottom={0} left={0} right={0} p={4} bg="transparent" color="white" zIndex="2">
              <ReelBottom currentVideo={currentVideo} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Flex position="absolute" top="55%" left="72%" flexDirection="column" justifyContent="space-evenly" height="300px">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box onClick={handleLike} cursor="pointer">
            {!isLiked ? <UnlikeLogoReel liked={false} /> : <UnlikeLogoReel liked={true} />}
          </Box>
          <span style={{ marginTop: '4px', fontSize: '12px', color: '#1C274C' }}>{likes}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box onClick={onOpen} cursor={'pointer'}>
            <Popover placement="right">
              <PopoverTrigger>
                <Box textAlign={'center'}>
                  <CommentReel />
                  <span style={{ marginTop: '4px', fontSize: '12px', color: '#1C274C' }}>{currentVideo?.comments?.length || 0}</span>
                </Box>
              </PopoverTrigger>
              <PopoverContent  boxShadow="0px 0px 4px cyan"  maxH={'300px'} overflow={'auto'} zIndex="popover" bg={'white'} border={'1px solid cyan'} borderRadius={'10px'}
                sx={{
                  '::-webkit-scrollbar': {
                    width: '5px', 
                  },
                  '::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '::-webkit-scrollbar-thumb': {
                    background: '#888',
                  },
                  '::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}>
                <PopoverCloseButton />
                <PopoverBody >
                  <CommentModal currentVideo={currentVideo} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </div>

        <Box cursor={'pointer'} onClick={handleShare}>
          <Popover placement="right">
            <PopoverTrigger>
              <Box textAlign={'center'}>
                <ShareButton />
              </Box>
            </PopoverTrigger>
            <PopoverContent maxH={'300px'} maxW={'250px'} overflow={'auto'} zIndex="popover" bg={'white'} border={'1px solid cyan'} borderRadius={'10px'}
             boxShadow="0px 0px 4px cyan" 
                sx={{
                  '::-webkit-scrollbar': {
                    width: '5px',
                  },
                  '::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                  },
                  '::-webkit-scrollbar-thumb': {
                    background: '#888',
                  },
                  '::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                  },
                }}>
                <PopoverCloseButton />
                <PopoverBody >
                {isFOpen &&(
                  <ShareProfiles profiles={followers} currentVideo={currentVideo}/>
                )}
                  
                </PopoverBody>
              </PopoverContent>
          </Popover>
        </Box>
        
        <SaveLogo />
        <MenuThreeDot />
      </Flex>
      <Box position={'absolute'} left={'90%'}>
        <Flex direction="column" align="center" mt="4" justifyContent={'space-evenly'} h={'200px'}>
          <ArrowUpIcon w={10} h={10} color="blue.500" rounded={'3xl'} border={'2px solid black'} p={'4px'} cursor={'pointer'} onClick={() => handleScroll('up')} />
          <ArrowDownIcon w={10} h={10} color="blue.500" rounded={'3xl'} border={'2px solid black'} p={'4px'} onClick={() => handleScroll('down')} cursor={'pointer'} />
        </Flex>
      </Box>
    </>
  );
}

export default Reel;
