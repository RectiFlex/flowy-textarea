
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Squares } from "@/components/ui/squares-background";
import { useState } from "react";
import { File, Folder, Tree } from "@/components/ui/file-tree";
import { Separator } from "@/components/ui/separator";

const PROJECT_FILES = [
  {
    id: "1",
    name: "src",
    children: [
      {
        id: "2",
        name: "components",
        children: [
          {
            id: "3",
            name: "ui",
            children: [
              {
                id: "4",
                name: "button.tsx",
              },
              {
                id: "5",
                name: "dialog.tsx",
              },
            ],
          },
        ],
      },
      {
        id: "6",
        name: "pages",
        children: [
          {
            id: "7",
            name: "index.tsx",
          },
        ],
      },
    ],
  },
];

const Index = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! What would you like to build today?'
    }
  ]);

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
          {/* File Tree */}
          <div className="w-64 h-full border-r border-neutral-800 p-4 bg-black/20">
            <Tree
              className="h-full rounded-md"
              initialExpandedItems={["1", "2", "3"]}
            >
              <Folder element="src" value="1">
                <Folder element="components" value="2">
                  <Folder element="ui" value="3">
                    <File value="4">button.tsx</File>
                    <File value="5">dialog.tsx</File>
                  </Folder>
                </Folder>
                <Folder element="pages" value="6">
                  <File value="7">index.tsx</File>
                </Folder>
              </Folder>
            </Tree>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 h-full border-r border-neutral-800 flex flex-col">
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
          <div className="w-[600px] h-full bg-neutral-900/50 flex flex-col">
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
