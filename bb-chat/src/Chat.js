import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  Thread,
  Window,
  ChannelList,
  ChannelListTeam,
  MessageList,
  MessageTeam,
  MessageInput,
  withChannelContext
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";
import { useAuth0 } from "./auth0";

import "stream-chat-react/dist/css/index.css";

const chatClient = new StreamChat("ujydutkcczb8");

function ChatView() {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth0();

  // Usernames can only contain alphabets, numbers, underscores and dashes
  const username = user.email.replace(/([^a-z0-9_-]+)/gi, "_");

  useEffect(() => {
    async function getToken() {
      setLoading(true);
      let token;
      try {
        const response = await axios.post("http://localhost:7000/join", {
          username
        });
        token = response.data.token;
      } catch (err) {
        console.log(err);
        return;
      }

      chatClient.setUser(
        {
          id: username,
          name: user.nickname
        },
        token
      );

      const channel = chatClient.channel("team", "group-messaging-2");

      try {
        await channel.watch();
      } catch (err) {
        console.log(err);
        return;
      }

      setChannel(channel);
      setLoading(false);
    }

    getToken();
  }, [setLoading, user.email, user.name, user.nickname, username]);

  if (loading || !user) {
    return <div>Loading chat...</div>;
  }

  if (channel) {
    const CustomChannelHeader = withChannelContext(
      class CustomChannelHeader extends React.PureComponent {
        render() {
          return (
            <div className="str-chat__header-livestream">
              <div className="str-chat__header-livestream-left">
                <p className="str-chat__header-livestream-left--title">
                  {this.props.channel.data.name}
                </p>
                <p className="str-chat__header-livestream-left--members">
                  {Object.keys(this.props.members).length} members,{" "}
                  {this.props.watcher_count} online
                </p>
              </div>
              <div className="str-chat__header-livestream-right">
                <div className="str-chat__header-livestream-right-button-wrapper">
                  <button
                    className="logout"
                    onClick={() =>
                      logout({
                        returnTo: "http://localhost:3000/"
                      })
                    }
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          );
        }
      }
    );

    return (
      <Chat client={chatClient} theme="team light">
        <ChannelList
          options={{
            subscribe: true,
            state: true
          }}
          List={ChannelListTeam}
        />
        <Channel channel={channel}>
          <Window>
            <CustomChannelHeader />
            <MessageList Message={MessageTeam} />
            <MessageInput focus />
          </Window>
          <Thread Message={MessageTeam} />
        </Channel>
      </Chat>
    );
  }

  return null;
}

export default ChatView;