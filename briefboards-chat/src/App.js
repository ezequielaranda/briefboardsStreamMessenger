import React from 'react';
import { Chat, Channel, ChannelList, Window } from 'stream-chat-react';
import { ChannelHeader, MessageList } from 'stream-chat-react';
import { MessageInput, Thread } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

import 'stream-chat-react/dist/css/index.css';

const chatClient = new StreamChat('ujydutkcczb8');
const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoicmFzcHktZGF3bi02In0.DOGstHQ5h4zQ0K9vtsNMB-MviTq_BTkurKotKf7PFwQ';

// custom channel preview component
class MyChannelPreview extends React.Component {
  render() {
      const {setActiveChannel, channel} = this.props;
      const unreadCount = channel.countUnread();

      return (
      <div className="channel_preview">
        <a href="#" onClick={(e) => setActiveChannel(channel, e)}>
          {channel.data.name}
        </a>

        <span>
          Unread messages: {unreadCount}
        </span>
      </div>
    );
  }
}

// a very minimalistic message component
class MyMessageComponent extends React.Component {
  render() {
    return <div><b>{this.props.message.user.name}</b> {this.props.message.text}</div>;
  }
}

chatClient.setUser(
  {
    id: 'raspy-dawn-6',
    name: 'Raspy dawn',
    image: 'https://getstream.io/random_svg/?id=raspy-dawn-6&name=Raspy+dawn'
  },
  userToken,
);

const filters = { type: 'messaging', members: { $in: ['raspy-dawn-6'] } };
const sort = { last_message_at: -1 };
const channels = chatClient.queryChannels(filters, sort);

const App = () => (
  <Chat client={chatClient} theme={'messaging light'}>
    <ChannelList
      filters={filters}
      sort={sort}
      Preview={MyChannelPreview}
    />
    <Channel Message={MyMessageComponent}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>
  </Chat>
);

export default App;