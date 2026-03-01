import { StreamChat } from "stream-chat";
import { Dispatch } from "react";
import { getAxiosInstance } from "@/app/utils/axiosInstance";
import { ChatAction } from "./reducers";
import { OrgUser } from "./context";

export function createChatActions(
  dispatch: Dispatch<ChatAction>,
  getClient: () => StreamChat | null,
) {
  const connectUser = async (userId: string, userName: string) => {
    dispatch({ type: "CONNECT_START" });
    try {
      const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

      // Pass userName so the token route can upsert this user into Stream
      const res = await fetch(
        `/api/stream/token?userId=${userId}&userName=${encodeURIComponent(userName)}`,
      );
      const { token } = await res.json();

      const client = StreamChat.getInstance(apiKey);
      await client.connectUser({ id: userId, name: userName }, token);

      dispatch({ type: "CONNECT_SUCCESS", payload: client });
    } catch (error) {
      console.error("Stream connect error:", error);
      dispatch({ type: "CONNECT_ERROR" });
    }
  };

  const disconnectUser = async () => {
    const client = getClient();
    if (client) {
      await client.disconnectUser();
    }
    dispatch({ type: "DISCONNECT" });
  };

  const fetchOrgUsers = async (searchTerm?: string) => {
    dispatch({ type: "USERS_LOADING" });
    try {
      const instance = getAxiosInstance();
      const params: any = { pageSize: 50 };
      if (searchTerm) params.searchTerm = searchTerm;

      const { data } = await instance.get("/api/users", { params });
      dispatch({ type: "USERS_SUCCESS", payload: data.items });
    } catch (error) {
      console.error("Fetch users error:", error);
      dispatch({ type: "USERS_ERROR" });
    }
  };

  // Upsert a user into Stream via the token route (server has the secret)
  const ensureStreamUser = async (user: OrgUser) => {
    await fetch(
      `/api/stream/token?userId=${user.id}&userName=${encodeURIComponent(user.fullName)}`,
    );
  };

  const openDirectMessage = async (otherUser: OrgUser) => {
    const client = getClient();
    if (!client || !client.userID) return null;

    try {
      // Ensure the other user exists in Stream before creating the channel
      await ensureStreamUser(otherUser);

      const channel = client.channel("messaging", {
        members: [client.userID, otherUser.id],
      });
      await channel.watch();
      dispatch({ type: "SET_ACTIVE_CHANNEL", payload: channel });
      return channel;
    } catch (error) {
      console.error("Open DM error:", error);
      return null;
    }
  };

  const openGroupChannel = async (name: string, members: OrgUser[]) => {
    const client = getClient();
    if (!client || !client.userID) return null;

    try {
      // Ensure all group members exist in Stream
      await Promise.all(members.map(ensureStreamUser));

      const memberIds = [client.userID, ...members.map((m) => m.id)];
      const channelId = `group-${Date.now()}`;

      const channel = client.channel("messaging", channelId, {
        name,
        members: memberIds,
      });
      await channel.watch();
      dispatch({ type: "SET_ACTIVE_CHANNEL", payload: channel });
      return channel;
    } catch (error) {
      console.error("Open group channel error:", error);
      return null;
    }
  };

  const setActiveChannel = (channel: any) => {
    dispatch({ type: "SET_ACTIVE_CHANNEL", payload: channel });
  };

  return {
    connectUser,
    disconnectUser,
    fetchOrgUsers,
    openDirectMessage,
    openGroupChannel,
    setActiveChannel,
  };
}
