import {useEffect, useState} from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore"
import { firestore } from "../firebase/firebase";


export const useGetFollowers = () =>{
    const [isLoading, setIsLoading] = useState(true);
    const [followers, setFollowers] = useState([]);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    useEffect(() => {
        const getFollowwers = async() => {
            setIsLoading(true);
            try{
                const userRef = collection(firestore, "users");
                const q = query(
                    userRef,
                    where("uid", "in", [authUser.uid, ...authUser.following]),
                    orderBy("uid")
                );

                const querySnapshot = await getDocs(q);
                const users = [];

                querySnapshot.forEach((doc) => {
                    users.push({...doc.data(), id: doc.id});
                })

                setFollowers(users);

            }catch(error){
                showToast("You don't follow anyone");
                console.log(error);
            }finally{
                setIsLoading(false);
            }
        };

        if(authUser) getFollowwers();
    }, [authUser, showToast]);
    return {isLoading, followers};
};
