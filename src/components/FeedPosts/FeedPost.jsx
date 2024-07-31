import { Box, Image, useColorModeValue } from "@chakra-ui/react";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";

const FeedPost = ({ post }) => {
  const { userProfile } = useGetUserProfileById(post.createdBy);

  // Ensure background is white in both color modes
  const bg = "white"; // Override colorModeValue

  // Adjust border color slightly for better contrast on white background
  const borderColor = useColorModeValue("gray.200", "gray.400");

  return (
    <Box
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      boxShadow="md"
      p={4}
      mb={4}
    >
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box my={2} borderRadius="md" overflow="hidden">
        <Image src={post.imageURL} alt="Feed Post Image" />
      </Box>
      <PostFooter post={post} creatorProfile={userProfile} />
    </Box>
  );
};

export default FeedPost;