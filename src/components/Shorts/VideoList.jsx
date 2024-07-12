import React from 'react';
import { Box, Flex, Text, Image, IconButton } from '@chakra-ui/react';
import { MdPlayArrow, MdPause } from 'react-icons/md'; // Example icons for play/pause

const ReelVideoContainer = ({ videoUrl, username, avatarUrl }) => {
    return (
        <Box maxWidth="600px" mx="auto" p={4} boxShadow="lg" borderRadius="lg" overflow="hidden">
            {/* Video Player */}
            <Box position="relative" height="0" paddingTop="56.25%">
                <video
                    src={videoUrl}
                    controls
                    autoPlay={false}
                    loop
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Play/Pause Button */}
                <IconButton
                    aria-label="Play/Pause"
                    icon={<MdPlayArrow />}
                    size="lg"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    zIndex="1"
                    onClick={(e) => {
                        const video = e.currentTarget.previousSibling;
                        if (video.paused) {
                            video.play();
                            e.currentTarget.icon = <MdPause />;
                        } else {
                            video.pause();
                            e.currentTarget.icon = <MdPlayArrow />;
                        }
                    }}
                />
            </Box>
            
            {/* User Info */}
            <Flex alignItems="center" mt={2}>
                <Image src={avatarUrl} alt="Avatar" boxSize="40px" borderRadius="full" />
                <Text ml={2} fontWeight="bold">{username}</Text>
            </Flex>
        </Box>
    );
};

export default ReelVideoContainer;
