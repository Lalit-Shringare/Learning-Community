import { Tooltip, Flex, Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MessageLogo } from "../../assets/constants"; // Ensure this path is correct

const MessageTooltip = ({ totalUnreadCount }) => {
  return (
    <Tooltip
      hasArrow
      label="Message"
      placement='right'
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link to="/MessagePage" style={{ textDecoration: 'none' }}>
        <Flex
          alignItems="center"
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <MessageLogo fill="yellow.100" totalUnreadCount={totalUnreadCount}/>
          {/* <Box>
            {totalUnreadCount > 0 ? (
              <Text fontSize="sm" color="red.500">{totalUnreadCount}</Text>
            ) : (
              <Text fontSize="sm" color="gray.500">0</Text>
            )}
          </Box> */}
          <Box display={{ base: "none", md: "block" }}>Message</Box>
        </Flex>
      </Link>
    </Tooltip>
  );
};

export default MessageTooltip;
