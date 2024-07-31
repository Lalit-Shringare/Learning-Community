import './Message.css';
import { useState, useEffect } from 'react';
import { Input, Spinner, Center, Box } from '@chakra-ui/react';
import { Profile } from './Profile';

export const MessageExp = ({ followers, isLoading, setSelectedProfile }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  useEffect(() => { 
    if (searchTerm.trim() === "") {
      setFilteredProfiles([]);
    } else {
      const filtered = followers.filter((profile) =>
        profile.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  }, [searchTerm, followers]);

  // Determine which profiles to display
  const profilesToDisplay = searchTerm.trim() === "" ? followers : filteredProfiles;

  return (
    <Box className="explore-parent" sx={{
        '::-webkit-scrollbar': {
          width: '5px',
        },
        '::-webkit-scrollbar-track': {
          bg: 'gray.100',
        },
        '::-webkit-scrollbar-thumb': {
          bg: 'gray.500',
          borderRadius: '8px',
        },
      }}>
      <Input
        bg={"gray.100"}
        placeholder='Search'
        _placeholder={{ color: "gray" }}
        type='search'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        marginBottom={'1rem'}
      />
      {
        <Profile profiles={profilesToDisplay} setSelectedProfile={setSelectedProfile} />
      }
    </Box>
  );
};
