// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StreamChat } = require("stream-chat");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_APP_SECRET
);

app.post("/join", async (req, res) => {
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username
      },
      token
    );

    const admin = { id: "admin" };
    const channel = serverSideClient.channel("team", "chat", {
      name: "Group messaging",
      created_by: admin
    });

    await channel.create();
    await channel.addMembers([username]);
  } catch (err) {
    res.status(500).json({ err: err.message });
    return;
  }

  return res.status(200).json({ user: { username }, token });
});

app.listen(7000, () => {
  console.log(`Server running on PORT 7000`);
});