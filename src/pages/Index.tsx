
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
          {/* Chat Interface - Left Side */}
          <div className="w-1/2 h-full flex flex-col border-r border-neutral-800">
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
          <div className="w-1/2 h-full flex flex-col">
            {/* Top Section with File Tree */}
            <div className="flex h-2/3">
              {/* File Tree */}
              <div className="w-64 h-full border-r border-neutral-800 bg-black/20 p-4">
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

              {/* Preview Area */}
              <div className="flex-1 flex flex-col">
                <div className="h-10 bg-neutral-900 border-b border-neutral-800 flex items-center px-4">
                  <button className="px-4 py-2 text-sm text-blue-400 border-b-2 border-blue-400">Code</button>
                  <button className="px-4 py-2 text-sm text-neutral-400">Preview</button>
                </div>
                <div className="flex-1 p-4 bg-black/20">
                  {/* Preview content goes here */}
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="h-1/3 border-t border-neutral-800 p-4 bg-black/20">
              <div className="h-full rounded-md bg-black/50 p-4 font-mono text-sm text-neutral-300 overflow-auto">
                <p className="text-green-500">$ Starting development server...</p>
                <p className="text-neutral-500 mt-2">Ready - started server on 0.0.0.0:3000</p>
                <p className="text-neutral-500">Event: compiled client and server successfully in 300 ms</p>
                <p className="text-neutral-400 mt-2 animate-pulse">▋</p>
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
