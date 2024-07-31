import { Box, Flex, Avatar, Text, Stack, Badge } from "@chakra-ui/react";
import { ProfileContext } from "./ProfileContext";
import { useContext } from "react";

export function Profile({ profiles, setSelectedProfile }) {
  const setdata = useContext(ProfileContext).setdata;

  return (
    <ProfileContext.Provider value={{ setdata }}>
      <Box borderRadius="md" w="100%" maxH="100%" overflowY="auto"
        
      
      >
        <Stack spacing={4} 
        >
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
                setdata(profile);
                setSelectedProfile(profile);
              }}
            >
              <Avatar src={profile.profilePicURL} name={profile.username} size="md" mr={3} />
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
    </ProfileContext.Provider>
  );
}
