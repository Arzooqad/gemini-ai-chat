import { GoogleGenAI } from '@google/genai';
import './App.css'
import { GEMINI_API_KEY } from './contants';
import ChatList from './components/ChatList/ChatList';

function App() {

  const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


  async function main() {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: 'Why is the sky blue?',
    });
    console.log(response.text);
  }
  
  main();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      <ChatList />
    </div>
  )
}

export default App
