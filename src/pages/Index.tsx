
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Squares } from "@/components/ui/squares-background";
import { useState } from "react";

const Index = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! What would you like to build today?'
    }
  ]);

  const handleSubmit = (message: string) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Add assistant response
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'I\'ll help you build that. Let me start the process...'
    }]);
    
    setIsBuilding(true);
  };

  return (
    <div className="relative min-h-screen w-full">
      <div className="fixed inset-0 -z-10">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333" 
          hoverFillColor="#222"
        />
      </div>
      
      {isBuilding ? (
        <div className="flex w-full h-screen">
          {/* Chat Interface */}
          <div className="w-1/2 h-full border-r border-neutral-800 flex flex-col">
            {/* Chat History */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <span className="text-sm text-white">
                      {message.role === 'assistant' ? 'v0' : 'you'}
                    </span>
                  </div>
                  <div className={`flex-1 rounded-lg p-4 ${
                    message.role === 'assistant' 
                      ? 'bg-neutral-900/50 text-neutral-200' 
                      : 'bg-blue-600/20 text-blue-200'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-neutral-800">
              <div className="w-full max-w-2xl mx-auto">
                <VercelV0Chat 
                  onSubmit={(msg: string) => {
                    setMessages(prev => [...prev, 
                      { role: 'user', content: msg },
                      { role: 'assistant', content: 'Processing your request...' }
                    ]);
                  }} 
                  inBuildMode={true} 
                />
              </div>
            </div>
          </div>
          
          {/* Preview Container */}
          <div className="w-1/2 h-full bg-neutral-900/50 p-4">
            <div className="w-full h-full rounded-xl border border-neutral-800 bg-black/50 backdrop-blur-sm overflow-hidden">
              <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center px-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-4 text-neutral-400 text-sm">
                Building your application...
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-2xl">
            <VercelV0Chat onSubmit={handleSubmit} inBuildMode={false} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
