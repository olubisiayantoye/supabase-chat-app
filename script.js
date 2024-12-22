const supabase = supabase.createClient('https://<YOUR_SUPABASE_URL>', '<YOUR_SUPABASE_ANON_KEY>');

async function loadMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching messages:', error);
    return;
  }

  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML = data
    .map(msg => `<div class="message"><strong>${msg.user_name}:</strong> ${msg.content}</div>`)
    .join('');
  chatBox.scrollTop = chatBox.scrollHeight;
}

supabase
  .channel('realtime:messages')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
    loadMessages();
  })
  .subscribe();

document.getElementById('chat-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const userName = document.getElementById('user_name').value;
  const messageContent = document.getElementById('message_content').value;

  const { error } = await supabase
    .from('messages')
    .insert([{ user_name: userName, content: messageContent }]);
  if (error) {
    console.error('Error sending message:', error);
    return;
  }

  document.getElementById('message_content').value = '';
});

loadMessages();
