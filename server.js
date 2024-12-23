const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabase = createClient('https://your-supabase-url.supabase.co', 'your-anon-key');

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get('/load-messages', async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return res.status(500).send('Error fetching messages');
  res.send(data.map(msg => `<p><strong>${msg.username}:</strong> ${msg.content}</p>`).join(''));
});

app.post('/send-message', async (req, res) => {
  const { username, message } = req.body;
  const { error } = await supabase
    .from('messages')
    .insert([{ username, content: message }]);
  if (error) return res.status(500).send('Error sending message');
  res.status(200).send('');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
