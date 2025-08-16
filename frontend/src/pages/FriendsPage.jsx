import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getUserFriends, getFriendRequests } from "../lib/api";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader";
import NoFriendsFound from "../components/NoFriendsFound";
import toast from "react-hot-toast";

const FriendsPage = () => {
  const previousRequests = useRef(0);
  
  const { data: friends, isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: requests, isLoading: loadingRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    refetchInterval: 10000, // Check for new requests every 10 seconds
  });

  useEffect(() => {
    // If we have requests data and the number of requests has increased
    if (requests?.incomingReqs && requests.incomingReqs.length > previousRequests.current) {
      // Get the new requests (requests that weren't there before)
      const newRequests = requests.incomingReqs.slice(previousRequests.current);
      
      // Show notification for each new request
      newRequests.forEach(request => {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-base-200 shadow-lg rounded-lg pointer-events-auto flex p-4 max-w-md`}>
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={request.sender.profilePic} alt={request.sender.fullName} />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium">{request.sender.fullName}</p>
                <p className="text-sm text-base-content/70">Sent you a friend request</p>
              </div>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right'
        });
      });
    }
    // Update the previous count
    if (requests?.incomingReqs) {
      previousRequests.current = requests.incomingReqs.length;
    }
  }, [requests?.incomingReqs]);

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
