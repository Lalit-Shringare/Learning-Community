import { Avatar, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import { Link } from "react-router-dom";

const ReelBottom = ({ currentVideo }) => {
	const { userProfile, isLoading } = useGetUserProfileById(currentVideo.createdBy);

	if (isLoading) return <CommentSkeleton />;
	return (
		<Flex gap={4}>
			<Link to={`/${userProfile.username}`}>
				<Avatar src={userProfile.profilePicURL} size={"sm"} />
			</Link>
			<Flex direction={"column"}>
				<Flex gap={2} alignItems={"center"}>
					<Link to={`/${userProfile.username}`}>
						<Text fontWeight={"bold"} fontSize={12}>
							{userProfile.username}
						</Text>
					</Link>
					
				</Flex>
				<Text fontSize={12} color={"#e6dbda"}>
					{currentVideo.caption}
				</Text>
			</Flex>
		</Flex>
	);
};

export default ReelBottom;

const CommentSkeleton = () => {
	return (
		<Flex gap={4} w={"full"} alignItems={"center"}>
			<SkeletonCircle h={10} w='10' />
			<Flex gap={1} flexDir={"column"}>
				<Skeleton height={2} width={100} />
				<Skeleton height={2} width={50} />
			</Flex>
		</Flex>
	);
};
