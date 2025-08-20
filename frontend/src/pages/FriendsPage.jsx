import { useQuery } from "@tanstack/react-query";
import { getUserFriends, getFriendRequests } from "../lib/api";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const { data: friends, isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: requests, isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  if (loadingFriends || loadingRequests) {
    return <PageLoader />;
  }

  const hasFriends = friends && friends.length > 0;
  const hasIncomingRequests = requests?.incomingReqs && requests.incomingReqs.length > 0;

  if (!hasFriends && !hasIncomingRequests) {
    return <NoFriendsFound />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* Friend Requests Section */}
        {hasIncomingRequests && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Friend Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.incomingReqs.map((request) => (
                <FriendCard
                  key={request._id}
                  friend={request.sender}
                  requestId={request._id}
                  isPendingRequest={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Friends Section */}
        {hasFriends && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Friends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
