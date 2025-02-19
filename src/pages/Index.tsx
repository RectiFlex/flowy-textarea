
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Squares } from "@/components/ui/squares-background";
import { useState, useEffect } from "react";
import { WebContainer } from '@webcontainer/api';

const Index = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! Welcome to ONE|X. What would you like to build today?'
    }
  ]);
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    if (isBuilding) {
      const bootWebContainer = async () => {
        try {
          const wc = await WebContainer.boot();
          setWebcontainerInstance(wc);

          await wc.mount({
            'index.html': {
              file: {
                contents: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>ONE|X App</title>
                    </head>
                    <body>
                      <div id="root"></div>
                    </body>
                  </html>
                `,
              },
            },
            'package.json': {
              file: {
                contents: `
                  {
                    "name": "onex-app",
                    "type": "module",
                    "dependencies": {}
                  }
                `
              }
            }
          });
        } catch (error) {
          console.error('Failed to boot WebContainer:', error);
        }
      };

      bootWebContainer();
    }
  }, [isBuilding]);

  const handleSubmit = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
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
          {/* Chat Interface - Left Side */}
          <div className="w-1/2 h-full flex flex-col border-r border-neutral-800">
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <span className="text-sm text-white">
                      {message.role === 'assistant' ? 'ONE|X' : 'you'}
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
              <div className="w-full">
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

          {/* Web Container - Right Side */}
          <div className="w-1/2 h-full">
            <iframe
              id="webcontainer-iframe"
              className="w-full h-full bg-white"
              title="WebContainer Preview"
            />
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
