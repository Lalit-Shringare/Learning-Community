import { Box, Flex, Avatar, Text, Stack } from "@chakra-ui/react";
import { ProfileContext } from "./ProfileContext";
import { useContext } from "react";
import React from "react";

export function Profile({ profiles }) {
  const  setdata = useContext(ProfileContext);

  return (
    <ProfileContext.Provider value={{setdata}}>
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
            onClick={() => {
              setdata.setdata(profile);
              console.log(profile);
            }}
          >
            <Avatar src={profile.profilePicURL} name={profile.username} size="md" mr={3} />
            <Text>{profile.username}</Text>
          </Flex>
        ))}
      </Stack>
    </Box>
    </ProfileContext.Provider>
  );
}
