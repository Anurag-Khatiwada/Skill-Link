import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Messages.css";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const [readConversations, setReadConversations] = useState(new Set());

  const { isLoading: isLoadingConversations, error: errorConversations, data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await newRequest.get("/conversations");
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const [users, setUsers] = useState({});

  useEffect(() => {
    if (conversations) {
      const fetchUsers = async () => {
        const userIds = conversations.map((conversation) =>
          currentUser.isFreelancer ? conversation.buyerId : conversation.sellerId
        );

        const userResponses = await Promise.all(
          userIds.map((userId) => newRequest.get(`/users/${userId}`))
        );

        const usersData = userResponses.reduce((acc, response, index) => {
          acc[userIds[index]] = response.data;
          return acc;
        }, {});

        setUsers(usersData);
      };

      fetchUsers();
    }
  }, [conversations, currentUser.isFreelancer]);

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
    onError: (err) => {
      console.error("Error submitting review:", err?.response?.data || err.message);
      alert(err?.response?.data || "Error submitting review");
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
    setReadConversations((prev) => new Set(prev).add(id)); // Mark this conversation as read
  };

  return (
    <div className="messages">
        <div className="messagescontainer">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>{currentUser.isFreelancer ? "Buyer" : "Seller"}</th>
                <th>Last Message</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {conversations?.map((conversation) => {
                const userId = currentUser.isFreelancer ? conversation.buyerId : conversation.sellerId;
                const user = users[userId];
                const userName = user?.username || "Loading...";

                // Check if conversation is unread
                const isUnread =
                  (currentUser.isFreelancer && !conversation.readBySeller) ||
                  (!currentUser.isFreelancer && !conversation.readByBuyer);
                const isRead = readConversations.has(conversation.id);

                return (
                  <tr
                    className={
                      isUnread && !isRead ? "active" : ""
                    }
                    key={conversation.id}
                  >
                    <td>{userName}</td>
                    <td>
                      <Link className="link" to={`/message/${conversation.id}`}>
                        {conversation?.lastMessage?.substring(0, 100) || "No messages yet"}...
                      </Link>
                    </td>
                    <td>{moment(conversation.updatedAt).fromNow()}</td>
                    <td>
                      {isUnread && !isRead && (
                        <button onClick={() => handleRead(conversation.id)} className="mar">
                          Mark As Read
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
    </div>
  );
};


export default Messages;
