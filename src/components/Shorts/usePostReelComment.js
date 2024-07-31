import {useState} from 'react'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import useShowToast from '../../hooks/useShowToast';
import useAuthStore from '../../store/authStore';
import usePostStore from '../../store/postStore';
import { firestore } from '../../firebase/firebase';

const usePostReelComment = () => {
    const [isCommenting, setIsCommenting] = useState(false);
    const showToast = useShowToast();
    const authUser = useAuthStore((state)=>state.user);
    const addComment = usePostStore((state)=> state.addComment);

    const handlePostComment = async (reelId, comment) =>{
        if(isCommenting) return;
        if (!authUser) return showToast("Error", "You must login first", "error");
        setIsCommenting(true);
        const newComment={
            comment,
            createdAt: Date.now(),
            createdBy: authUser.uid,
            reelId,
        };
        try{
            await updateDoc(doc(firestore, "reels", reelId), {
                comments: arrayUnion(newComment),
            });
            addComment(reelId, newComment);
        } catch(error){
            showToast("Error", error.message, "eroor");
        } finally{
            setIsCommenting(false);
        }
    };
    return {isCommenting, handlePostComment};
}
export default usePostReelComment;
