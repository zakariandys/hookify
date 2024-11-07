const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Replace this with your actual DingTalk webhook URL
const DINGTALK_WEBHOOK_URL = 'https://oapi.dingtalk.com/robot/send?access_token=fb9aa5c4cf799d763cb96c7c28b1e41f70efd2d1b568b08f596d7225413c7c05';

// Webhook endpoint to receive Bitbucket events
app.post('/bitbucket-webhook', async (req, res) => {
  console.log('Received webhook:', req.body);

  // Check if the event contains a comment (you can modify this check based on your needs)
  if (req.body && req.body.comment) {
    const commentAuthor = req.body.comment.user.display_name;
    const commentContent = req.body.comment.content.raw;
    const pullRequestTitle = req.body.pullrequest.title;
    const pullRequestUrl = req.body.pullrequest.links.html.href;

    // Construct the message for DingTalk
    const message = {
      msgtype: 'text',
      text: {
        content: `@${commentAuthor} commented on your pull request "${pullRequestTitle}".\nComment: "${commentContent}".\nPlease check: ${pullRequestUrl}`
      }
    };

    try {
        // Send the message to DingTalk and capture the response
        const response = await axios.post(DINGTALK_WEBHOOK_URL, message);

        // Log the response details
        console.log('Notification sent to DingTalk');
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        // Acknowledge the webhook
        res.sendStatus(200);
    } catch (error) {
      console.error('Error sending notification to DingTalk:', error);
      res.sendStatus(500); // Internal server error
    }
  } else {
    res.sendStatus(400); // Bad request if no comment is found
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});
