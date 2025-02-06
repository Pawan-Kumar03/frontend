import { Mail, Phone, MessageCircle } from "lucide-react";

const AgentCard = ({ agent, onContactClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[300px] fixed top-24 right-4">
      <div className="flex flex-col items-center">
        <img
          src={agent.profilePhoto}
          alt={agent.agentName}
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="text-xl font-semibold mb-2">{agent.agentName}</h3>
        <p className="text-blue-500 mb-4 text-sm">View All Properties</p>
        <p className="text-gray-600 mb-4">Beytiecom Vacation Homes Rental L.L.C</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onContactClick("Email")}
          className="flex items-center justify-center bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors"
        >
          <Mail className="w-6 h-6 text-blue-500" />
        </button>
        <button
          onClick={() => onContactClick("Call")}
          className="flex items-center justify-center bg-red-50 rounded-lg p-4 hover:bg-red-100 transition-colors"
        >
          <Phone className="w-6 h-6 text-red-500" />
        </button>
        <button
          onClick={() => onContactClick("WhatsApp")}
          className="flex items-center justify-center bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors"
        >
          <MessageCircle className="w-6 h-6 text-green-500" />
        </button>
      </div>
    </div>
  );
};

export default AgentCard;