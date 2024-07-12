import './Message.css';
import React, { useState } from 'react';
import { Input, Spinner, Center } from '@chakra-ui/react';
import { Profile } from './Profile.jsx';
import { useGetFollowers } from '../../hooks/useGetFollowers.js';

export const MessageExp = () => {
  const { isLoading, followers } = useGetFollowers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProfiles, setFilteredProfiles] = useState([]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter profiles based on the search term
    if (value.trim() === "") {
      setFilteredProfiles([]);
    } else {
      const filtered = followers.filter((profile) =>
        profile.username.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProfiles(filtered);
    }
  };

  // Determine which profiles to display
  const profilesToDisplay = searchTerm.trim() === "" ? followers : filteredProfiles;

  return (
    <div className="explore-parent">
      <Input
        bg={"gray.100"}
        placeholder='Search'
        _placeholder={{ color: "gray" }}
        type='search'
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {
        isLoading ? (
          <Center h="100%">
            <Spinner size="xl" />
          </Center>
        ) : (
          <Profile profiles={profilesToDisplay} />
        )
      }
    </div>
  );
};
