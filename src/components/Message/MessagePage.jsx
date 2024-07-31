import './Message.css';
import { ProfileProvider } from './ProfileContext';
import MessageArea from './MessageArea';
import { MessageExp } from './MessageExp';
import { useState } from 'react';
import { Box, useMediaQuery } from '@chakra-ui/react';

const MessagePage = ({ followers, isLoading }) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <ProfileProvider>
      <Box className="top-parent" display="flex">
        <Box 
          display={{ base: selectedProfile ? 'none' : 'block', md: 'block' }} 
          flex="6" 
          m={'1rem'}
          borderRight={{ base: 'none', md: '1px solid rgb(219, 219, 219)' }}
          border={{md:'1px solid cyan'}}
          borderTopLeftRadius={'10px'}
          borderTopRadius={'10px'}
          p={'1rem'}
          boxShadow={'0px 0px 4px cyan'}
        >
          <MessageExp followers={followers} isLoading={isLoading} setSelectedProfile={setSelectedProfile} />
        </Box>
        {isLargerThan768 || selectedProfile ? (
          <MessageArea 
            className="messageArea" 
            selectedProfile={selectedProfile} 
            setSelectedProfile={setSelectedProfile}
          />
        ) : null}
      </Box>
    </ProfileProvider>
  );
};

export default MessagePage;
