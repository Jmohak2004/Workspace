import React from 'react';
import './App.css';

function App() {
  const apps = [
    { id: 'bot', name: 'Bot', icon: '🤖' ,link : 'https://chatbot-fhi84rm47-mohakj-somaiyaedus-projects.vercel.app/'},
    { id: 'chat', name: 'Chat', icon: '💬' , link:'https://chat-app-ruddy-six-38.vercel.app/'},//1
    { id: 'chess', name: 'Chess', icon: '♟️' ,link:'https://workspace-sel3.vercel.app'},
    { id: 'conversion', name: 'Conversion', icon: '🔄',link:'https://currency-converter-hazel-two.vercel.app/' },
    // { id: 'drive', name: 'Drive', icon: '📂' ,link:'https://google.com'}, //2
    // { id: 'maps', name: 'Maps', icon: '🗺️',link:'https://google.com' }, 
    { id: 'cab', name: 'Cab', icon: "🚗" ,link:'https://cab-nine.vercel.app/' }, //3
    { id: 'news', name: 'News', icon: '📰' ,link:'https://workplace-news.vercel.app/'},
    { id: 'voting', name: 'Voting', icon: '📺',link:'https://workspace-5275.vercel.app' },
    { id: 'translate', name: 'Translate', icon: '🌐' ,link:'https://workspace-4oqc.vercel.app'}
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
