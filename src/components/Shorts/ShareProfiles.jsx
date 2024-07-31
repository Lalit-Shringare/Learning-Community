import { Box, Flex, Avatar, Text, Stack, Badge } from "@chakra-ui/react";
import { useState } from "react";
import { firestore } from "../../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import useAuthStore from "../../store/authStore";

export function ShareProfiles({ profiles, currentVideo }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [message, setMessage] = useState("");
  const authUser = useAuthStore((state) => state.user);

  const sendMessage = (profile) => {
    setSelectedProfile(profile);
    setMessage(currentVideo?.videoURL);
    handleSendMessage(profile);
  };

  const handleSendMessage = async (profile) => {
    if (message.trim() !== "") {
      const timestamp = serverTimestamp();  
      const senderMessageObject = {
        message: message,
        time: timestamp,
        to: profile.id,
        from: authUser.uid,
        isSeen: true,
      };
      const receiverMessageObject = {
        message: message,
        time: timestamp,
        to: profile.id,
        from: authUser.uid,
        isSeen: false,
      };

      try {
        await addDoc(collection(firestore, `Messages/${authUser.uid}/message/${profile.id}/messages`), senderMessageObject);
        await addDoc(collection(firestore, `Messages/${profile.id}/message/${authUser.uid}/messages`), receiverMessageObject);

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
        console.log(authUser.uid);
        console.log(profile.id);
        console.log(senderMessageObject);
        console.log(receiverMessageObject);
      }
    }
  };

  return (
    <Box borderRadius="md" w="100%" maxH="100%" overflowY="auto">
      <Stack spacing={4}>
        {profiles.map((profile) => (
          <Flex
            key={profile.id}
            align="center"
            p={2}
            borderRadius="md"
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
            borderColor={profile.unseenMessage ? "red.500" : "gray.200"}
            borderWidth={2}
            onClick={() => {
              sendMessage(profile);
            }}
          >
            <Avatar src={profile.profilePicURL} name={profile.username} size={'sm'} mr={3} />
            <Text flex="1">{profile.username}</Text>
            {profile.unreadCount > 0 && (
              <Badge ml={2} bg={'cyan'} color={'red'} borderRadius={'15px'}>
                {profile.unreadCount}
              </Badge>
            )}
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}
