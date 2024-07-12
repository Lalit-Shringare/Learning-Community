
import { Tooltip, Flex, Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { MessageLogo } from "../../assets/constants"; // Adjust the import path as needed

const MessageTooltip = () => {
  return (
    <Tooltip
      hasArrow
      label={"Message"}
      placement='right'
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Link to="/MessagePage" style={{ textDecoration: 'none' }}>
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
        >
          <MessageLogo fill="yellow.100" />
          <Box display={{ base: "none", md: "block" }}>Message</Box>
        </Flex>
      </Link>
    </Tooltip>
  );
};

export default MessageTooltip;
