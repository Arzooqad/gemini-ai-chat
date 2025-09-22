import "./App.css";
import ChatList from "./components/ChatList/ChatList";
import SualIcon from "./assets/sualIcon.svg";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 overflow-hidden">
      <div className="bg-white flex items-center justify-start py-2 px-6">
        <img src={SualIcon} alt="Sual Logo" className="h-16" />
      </div>
      <ChatList />
    </div>
  );
}

export default App;
