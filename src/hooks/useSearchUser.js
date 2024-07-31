import { useState } from "react";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

const useSearchUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const showToast = useShowToast();

    const searchUsers = async (searchTerm) => {
        if (searchTerm.length === 0) {
            setUsers([]);
            return;
        }
        setIsLoading(true);
        try {
            const usersRef = collection(firestore, "users");
            const q = query(
                usersRef,
                orderBy("username"),
                limit(50) // Increased limit to get more potential matches
            );

            const querySnapshot = await getDocs(q);
            const userResults = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const lowercaseSearchTerm = searchTerm.toLowerCase();
                if (
                    userData.username.toLowerCase().includes(lowercaseSearchTerm) ||
                    (userData.fullName && userData.fullName.toLowerCase().includes(lowercaseSearchTerm))
                ) {
                    userResults.push(userData);
                }
            });
            setUsers(userResults.slice(0, 10)); // Limit to 10 results for display
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, searchUsers, users };
};

export default useSearchUser;