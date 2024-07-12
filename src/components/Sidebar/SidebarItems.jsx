import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import ProfileLink from "./ProfileLink";
import Search from "./Search";
import Message from "../Message/Message";

const SidebarItems = () => {
	return (
		<>
			<Home />
			<Search />
			<Notifications />
			<Message/>
			<CreatePost />
			<ProfileLink />
			
		</>
	);
};

export default SidebarItems;
