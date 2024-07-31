import {
    Box,
    Flex,
    Input,
    Button,
    VStack,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react'; 
  import usePostReelComment from './usePostReelComment';
  import Comment from '../Comment/Comment';
  import { firestore } from '../../firebase/firebase';
  import { doc, onSnapshot } from 'firebase/firestore';
  
  export const CommentModal = ({ currentVideo }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { isCommenting, handlePostComment } = usePostReelComment();
  
    useEffect(() => {
      if (currentVideo?.id) {
        // console.log(`Setting up listener for video ID: ${currentVideo.id}`);
        const unsubscribe = onSnapshot(doc(firestore, 'reels', currentVideo.id), (doc) => {
          if (doc.exists()) {
            const commentsData = doc.data().comments || [];
            setComments(commentsData);
          } else {
            console.log('No such document!');
          }
        });
  
        return () => unsubscribe(); // Clean up the listener on unmount
      }
    }, [currentVideo]);
  
    const handleSubmitComment = async () => {
      if (!newComment.trim()) return;
      await handlePostComment(currentVideo.id, newComment);
      setNewComment('');
    };
  
    if (!currentVideo) {
      return <Box p={2}>Loading...</Box>; // or some other placeholder
    }
  
    return (
      <Box p={2} maxW="500px" mx="auto">
        <Box paddingBottom={'50px'}>
          <VStack spacing={2} align="stretch">
            {comments.map((comment, idx) => (
              <Comment key={idx} comment={comment} />
            ))}
          </VStack>
        </Box>
        <Box
          mt={4}
          position="fixed"
          bottom="0"
          left="0"
          width="100%"
          bg="white"
          p={2}
          borderBlockEnd={'1px solid black'}
          borderInline={'1px solid black'}
          borderRadius={'10px'}
          borderInlineStartRadius={'0px'}
          borderInlineEndRadius={'0px'}
          borderBottomStartRadius={'10px'}
          borderBottomEndRadius={'10px'}
        >
          <Flex>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              _placeholder={{ color: "black" }}
              border={'1px solid black'}
              mr={2}
            />
            <Button
              onClick={handleSubmitComment}
              colorScheme="blue"
              isLoading={isCommenting}
            >
              Post
            </Button>
          </Flex>
        </Box>
      </Box>
    );
  };
  