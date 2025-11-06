/*
  Vanilla JS chat widget converted from the React component.
  This file creates a floating chat widget on the page and provides
  a simple rule-based botResponse() function similar to the React version.

  Note: This is a frontend-only demo. Do NOT add real API keys to client-side code.
*/

(function () {
  const suggestionChips = [
    "What's my next class?",
    'Book appointments',
    'Show my scholarships',
    'Campus navigation help',
    'Study timer status',
    'Motivational tips'
  ];

  // Minimal styles for the widget
  const css = `
  .chat-widget { position: fixed; right: 20px; bottom: 20px; z-index: 6000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
  .chat-button { width:56px; height:56px; border-radius:50%; background:linear-gradient(90deg,#00d9ff,#ff0070); color:#000; border:none; font-size:24px; cursor:pointer; box-shadow:0 8px 24px rgba(0,0,0,0.25); }
  .chat-panel { width:360px; max-height:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 12px 40px rgba(0,0,0,0.4); display:flex; flex-direction:column; }
  .chat-header { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:12px 14px; display:flex; justify-content:space-between; align-items:center; font-weight:600; }
  .chat-close { background:transparent; border:none; color:#fff; font-size:18px; cursor:pointer; }
  .chat-messages { padding:14px; background:#f8fafc; flex:1; overflow:auto; display:flex; flex-direction:column; gap:10px; }
  .msg-bot { align-self:flex-start; background:#fff; padding:10px 12px; border-radius:12px; max-width:85%; box-shadow:0 2px 6px rgba(0,0,0,0.06); color:#0f172a; white-space:pre-line; }
  .msg-user { align-self:flex-end; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:10px 12px; border-radius:12px; max-width:85%; }
  .chat-chips { padding:10px; border-top:1px solid #eef2ff; display:flex; gap:8px; flex-wrap:wrap; background:#fff; }
  .chip { padding:8px 12px; border-radius:999px; background:#f1f5f9; color:#6366f1; border:1px solid #e2e8f0; cursor:pointer; font-size:0.85rem; }
  .chat-input-row { padding:10px; display:flex; gap:8px; border-top:1px solid #eef2ff; background:#fff; }
  .chat-input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #e6eef8; outline:none; }
  .send-btn { padding:8px 14px; border-radius:10px; border:none; background:linear-gradient(90deg,#00d9ff,#ff0070); color:#000; cursor:pointer; }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Build DOM
  const widget = document.createElement('div');
  widget.className = 'chat-widget';

  const button = document.createElement('button');
  button.className = 'chat-button';
  button.title = 'Open chat';
  button.textContent = '💬';

  const panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.style.display = 'none';

  const header = document.createElement('div');
  header.className = 'chat-header';
  header.innerHTML = `<div>🎓 Student Assistant</div>`;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'chat-close';
  closeBtn.innerHTML = '&times;';
  header.appendChild(closeBtn);

  const messagesWrap = document.createElement('div');
  messagesWrap.className = 'chat-messages';

  const chipsWrap = document.createElement('div');
  chipsWrap.className = 'chat-chips';
  suggestionChips.forEach(ch => {
    const c = document.createElement('button');
    c.className = 'chip';
    c.textContent = ch;
    c.addEventListener('click', () => sendMessage(ch));
    chipsWrap.appendChild(c);
  });

  const inputRow = document.createElement('div');
  inputRow.className = 'chat-input-row';
  const input = document.createElement('input');
  input.className = 'chat-input';
  input.type = 'text';
  input.placeholder = 'Type your message...';
  const sendBtn = document.createElement('button');
  sendBtn.className = 'send-btn';
  sendBtn.textContent = 'Send';
  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);

  panel.appendChild(header);
  panel.appendChild(messagesWrap);
  panel.appendChild(chipsWrap);
  panel.appendChild(inputRow);

  widget.appendChild(button);
  widget.appendChild(panel);
  // Append widget inside #mainDashboard so it remains hidden on landing/login pages
  const dashboardContainer = document.getElementById('mainDashboard') || document.body;
  dashboardContainer.appendChild(widget);

  // State
  let lastBotContext = null;

  function isAffirmative(msg) {
    const affirmatives = ['yes', 'ya', 'yeah', 'ok', 'k', 'okay', 'sure', 'yep', 'yup', 'please'];
    return affirmatives.includes(msg.trim().toLowerCase());
  }

  function isNegative(msg) {
    const negatives = ['no', 'nope', 'nah', 'not now', 'later'];
    return negatives.includes(msg.trim().toLowerCase());
  }

  function botResponse(userMsg) {
    const lowerMsg = userMsg.toLowerCase();

    if (isAffirmative(userMsg)) {
      if (lastBotContext === 'appointments') {
        lastBotContext = null;
        return "Perfect! Here are available slots:\n• Dr. Smith (Counselor) - Tomorrow 2PM\n• Dr. Johnson (Health) - Friday 10AM\nWhich one would you prefer?";
      } else if (lastBotContext === 'study_timer') {
        lastBotContext = null;
        return "🎯 Study timer started! 25 minutes of focused work time. I'll notify you when it's time for a break. Good luck!";
      } else if (lastBotContext === 'navigation') {
        lastBotContext = null;
        return "I can show you the quickest route. Which building are you trying to reach?";
      }
      return 'Great! What would you like help with?';
    }

    if (isNegative(userMsg)) {
      lastBotContext = null;
      return 'No problem! Let me know if you need anything else. 😊';
    }

    if (lowerMsg.includes('class') || lowerMsg.includes('schedule')) {
      lastBotContext = null;
      return '📚 Your next class is:\n• Computer Science 101\n• Time: 2:00 PM - 3:30 PM\n• Room: Engineering Block, Room 305\n• Professor: Dr. Anderson';
    } else if (lowerMsg.includes('appointment')) {
      lastBotContext = 'appointments';
      return 'I can help you book appointments with counselors or health services. Would you like to see available time slots?';
    } else if (lowerMsg.includes('scholarship')) {
      lastBotContext = null;
      return '🎓 Your Scholarship Status:\n• Merit Scholarship - Pending Review\n• Athletic Scholarship - Approved ✓\n• Upcoming Deadline: Nov 15th for Spring Applications';
    } else if (lowerMsg.includes('navigation') || lowerMsg.includes('campus') || lowerMsg.includes('find') || lowerMsg.includes('where')) {
      lastBotContext = 'navigation';
      return '🗺️ I can help you navigate campus! Popular locations:\n• Library\n• Student Center\n• Cafeteria\n• Engineering Block\nWould you like directions?';
    } else if (lowerMsg.includes('timer') || lowerMsg.includes('study')) {
      lastBotContext = 'study_timer';
      return '⏱️ Your study timer is currently inactive. Would you like to start a 25-minute Pomodoro focus session?';
    } else if (lowerMsg.includes('motivat') || lowerMsg.includes('quote') || lowerMsg.includes('inspire')) {
      lastBotContext = null;
      const quotes = [
        '💪 "Success is the sum of small efforts repeated day in and day out." - Keep pushing forward!',
        '🌟 "The expert in anything was once a beginner." - You\'re doing great!',
        '🚀 "Education is the passport to the future." - Your hard work will pay off!',
        '✨ "Believe you can and you\'re halfway there." - Keep believing in yourself!',
        '🎯 "The only way to do great work is to love what you do." - Stay passionate!'
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    } else if (lowerMsg.includes('help') || lowerMsg === 'hi' || lowerMsg === 'hello') {
      lastBotContext = null;
      return "I'm your student assistant! I can help you with:\n• Class schedules\n• Booking appointments\n• Scholarship information\n• Campus navigation\n• Study timers\n• Motivational support\n\nWhat would you like to know?";
    }

    lastBotContext = null;
    return `I'm here to help with "${userMsg}"! Try asking about your classes, appointments, scholarships, campus navigation, or study tools. 🎓`;
  }

  function appendMessage(role, text) {
    const el = document.createElement('div');
    el.className = role === 'user' ? 'msg-user' : 'msg-bot';
    el.textContent = text;
    messagesWrap.appendChild(el);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    appendMessage('user', text.trim());
    // simulate typing
    const loading = document.createElement('div');
    loading.className = 'msg-bot';
    loading.textContent = '...';
    messagesWrap.appendChild(loading);
    messagesWrap.scrollTop = messagesWrap.scrollHeight;

    setTimeout(() => {
      loading.remove();
      const reply = botResponse(text);
      appendMessage('bot', reply);
    }, 600 + Math.random() * 600);
  }

  // Handlers
  button.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    if (panel.style.display !== 'none') input.focus();
  });
  closeBtn.addEventListener('click', () => panel.style.display = 'none');
  sendBtn.addEventListener('click', () => { sendMessage(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(input.value); input.value = ''; } });

  // initial bot greeting
  appendMessage('bot', 'Hello! How can I help you today?');

  // expose for debugging
  window.studentAssistantWidget = { open: () => { panel.style.display = 'flex'; input.focus(); }, close: () => { panel.style.display = 'none'; } };

})();