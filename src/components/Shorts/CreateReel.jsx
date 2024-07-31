import { useState, useRef } from "react";
import { MdVideocam } from 'react-icons/md';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tooltip,
  Textarea,
  CloseButton,
  useDisclosure,
  Icon
} from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import usePreviewVideo from "../../hooks/usePreviewVideo";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caption, setCaption] = useState("");
  const videoRef = useRef(null);
  const showToast = useShowToast();
  const { isLoading, handleCreatePost } = useCreatePost();
  const { handleVideoChange, selectedFile, setSelectedFile } = usePreviewVideo();
  const { pathname } = useLocation();

  const handlePostCreation = async () => {
    try {
      if (!selectedFile) {
        throw new Error("Please select a video");
      }

      await handleCreatePost(selectedFile, caption);
      onClose();
      setCaption("");
      setSelectedFile(null); // Clear selected video
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}
      >
        <Flex
          alignItems="center"
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={onOpen}
        >
          <Icon as={MdVideocam} w={6} h={6} />
          <Box display={{ base: "none", md: "block" }}>Clip</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="md">
          <ModalHeader borderBottom="1px solid gray">Create Clip</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Textarea
              placeholder="Post caption..."
              _placeholder={{ color: "black" }}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              bg="gray.50"
              borderRadius="md"
            />
            <Input type="file" hidden ref={videoRef} accept="video/*" onChange={handleVideoChange} />

            <Flex alignItems="center" mt={4}>
              <Button
                onClick={() => videoRef.current.click()}
                leftIcon={<BsFillImageFill />}
                colorScheme="blue"
                variant="outline"
              >
                Add Video
              </Button>
            </Flex>
            {selectedFile && (
              <Flex mt={5} w="full" position="relative" justifyContent="center">
                <video src={selectedFile} alt="Selected video" style={{ maxWidth: "100%", maxHeight: "400px", borderRadius: "md" }} controls />
                <CloseButton
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePostCreation} isLoading={isLoading}>
              Post
            </Button>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

function useCreatePost() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user);
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreatePost = async (selectedFile, caption) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Create new post object
      const newPost = {
        caption: caption,
        likes: [],
        comments: [],
        createdAt: Date.now(),
        createdBy: authUser.uid,
      };

      // Add new post document to Firestore
      const postDocRef = await addDoc(collection(firestore, "reels"), newPost);

      // Update user's posts array in Firestore
      const userDocRef = doc(firestore, "users", authUser.uid);
      await updateDoc(userDocRef, { reels: arrayUnion(postDocRef.id) });

      // Upload video file to Firebase Storage
      const videoStorageRef = ref(storage, `reels/${postDocRef.id}/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(videoStorageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          throw new Error("Error uploading video: " + error.message);
        },
        async () => {
          // Upload completed successfully, get download URL
          const downloadURL = await getDownloadURL(videoStorageRef);
          newPost.videoURL = downloadURL;

          // Update post document in Firestore with video URL
          await updateDoc(postDocRef, { videoURL: downloadURL });

          // Update local state if the current user's profile
          if (userProfile.uid === authUser.uid) {
            createPost({ ...newPost, id: postDocRef.id });
          }

          // Add post to user's profile if not on their own profile page
          if (pathname !== "/" && userProfile.uid === authUser.uid) {
            addPost({ ...newPost, id: postDocRef.id });
          }

          showToast("Success", "Post created successfully", "success");
        }
      );
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
}
