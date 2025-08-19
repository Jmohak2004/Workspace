import React from 'react';
import './App.css';

function App() {
  const apps = [
    { id: 'bot', name: 'Bot', icon: '🤖' ,link : 'https://chatbot-fhi84rm47-mohakj-somaiyaedus-projects.vercel.app/'},
    { id: 'chat', name: 'Chat', icon: '💬' , link:'https://google.com'},
    { id: 'chess', name: 'Chess', icon: '♟️' ,link:'https://google.com'},
    { id: 'conversion', name: 'Conversion', icon: '🔄',link:'https://google.com' },
    { id: 'drive', name: 'Drive', icon: '📂' ,link:'https://google.com'},
    { id: 'maps', name: 'Maps', icon: '🗺️',link:'https://google.com' },
    { id: 'meet', name: 'Meet', icon: '📹',link:'https://google.com' },
    { id: 'news', name: 'News', icon: '📰' ,link:'https://google.com'},
    { id: 'stream', name: 'Stream', icon: '📺',link:'https://google.com' },
    { id: 'translate', name: 'Translate', icon: '🌐' ,link:'https://google.com'}
  ];

  return (
    <div className="app-container">
      {apps.map(app => (
        <div key={app.id} className="app-link" id={app.id}>
          <div className="icon">{app.icon}</div>
          <div className="app-name">
            <a href={app.link}>
              {app.name}
            </a>
          </div>
        </div>
      ))}
      <div className='text'>Workplace</div>
    </div>
  );
}

export default App;
