import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { Link } from 'react-router-dom';

const FollowerList = ({ isFOpen, onFClose, followers }) => {
  const [followerProfiles, setFollowerProfiles] = useState([]);
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const fetchFollowerProfiles = async () => {
      const profiles = await Promise.all(followers.map(async (followerId) => {
        const docRef = doc(db, "users", followerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: followerId, ...docSnap.data() };
        } else {
          console.log("No such document!");
          return null;
        }
      }));
      setFollowerProfiles(profiles.filter(profile => profile !== null));
    };

    if (isFOpen) {
      fetchFollowerProfiles();
    }
  }, [isFOpen, followers, db]);

  return (
    <Modal isOpen={isFOpen} onClose={onFClose}>
      <ModalOverlay />
      <ModalContent bg={"white"} boxShadow={"xl"} border={"1px solid gray"} mx={3}>
        <ModalHeader>Followers</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {followerProfiles.map((profile) => (
                
              <Flex
                key={profile.id}
                align={'center'}
                p={2}
                borderRadius={'md'}
                _hover={{ bg: "gray.100" }}
                cursor={'pointer'}
              >
               <Link to={`/${profile.username}`}>
                 <Avatar src={profile.profilePicURL} name={profile.username} size={'md'} mr={3} />
               </Link>
                
                <Text>{profile.username}</Text>
              </Flex>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FollowerList;
