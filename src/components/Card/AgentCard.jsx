import React from "react";

const AgentCard = ({ agent }) => {
  return (
    <div className="bg-primary border rounded-2xl shadow-lg p-4 max-w-sm flex flex-col items-center">
      <img
        src={agent.profilePhoto}
        alt={agent.agentName}
        className="w-20 h-20  rounded-full object-cover mb-2"
      />
      <h2 className="text-lg font-semibold text-primary">{agent.agentName}</h2>
      <a href="#" className="text-blue-500 text-sm mb-2">View All Properties</a>
      <p className="text-gray-500 text-sm text-center">Investibayt Realty</p>
      
      <div className="flex justify-between w-full mt-3">
        <a
          href={`mailto:${agent.agentEmail}`}
          className="flex-1 text-center py-2 rounded-lg bg-blue-100 text-blue-500 mx-1"
        >
          ✉ Email
        </a>
        <a
          href={`tel:${agent.contactNumber}`}
          className="flex-1 text-center py-2 rounded-lg bg-red-100 text-red-500 mx-1"
        >
          ☎ Call
        </a>
        <a
          href={`https://wa.me/${agent.contactWhatsApp.replace('+', '')}`}
          className="flex-1 text-center py-2 rounded-lg bg-green-100 text-green-500 mx-1"
        >
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
};

export default AgentCard;
