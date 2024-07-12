import { Box, Flex, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { BsBookmark, BsGrid3X3, BsHandThumbsUp } from "react-icons/bs";
import ProfilePosts from "./ProfilePosts";

const ProfileTabs = () => {
  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      <Tabs w="full">
        <TabList justifyContent="center" gap={'50px'}>
          <Tab alignItems={"center"} p='3' gap={1} cursor={"pointer"}>
            <Box fontSize={20}>
              <BsGrid3X3 />
            </Box>
            <Text fontSize={12} display={{ base: "none", sm: "block" }}>
              Posts
            </Text>
          </Tab>
          
          <Tab alignItems={"center"} p='3' gap={1} cursor={"pointer"}>
            <Box fontSize={20}>
              <BsBookmark />
            </Box>
            <Text fontSize={12} display={{ base: "none", sm: "block" }}>
              Saved
            </Text>
          </Tab>

          <Tab alignItems={"center"} p='3' gap={1} cursor={"pointer"}>
            <Box fontSize={20}>
              <BsHandThumbsUp fontWeight={"bold"} />
            </Box>
            <Text fontSize={12} display={{ base: "none", sm: "block" }}>
              Likes
            </Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProfilePosts /> 
          </TabPanel>
          <TabPanel>
            {/* Content of Tab 2 */}
          </TabPanel>
          <TabPanel>
            {/* Content of Tab 3 */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default ProfileTabs;
