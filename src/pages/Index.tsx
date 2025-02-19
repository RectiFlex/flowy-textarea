import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Squares } from "@/components/ui/squares-background";
import { useState, useEffect } from "react";
import { WebContainer } from '@webcontainer/api';
import { useToast } from "@/components/ui/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const Index = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [loadingState, setLoadingState] = useState<string>('');
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! Welcome to ONE|X. What would you like to build today?'
    }
  ]);
  const [webcontainerInstance, setWebcontainerInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    return () => {
      if (webcontainerInstance) {
        (async () => {
          try {
            await webcontainerInstance.teardown();
          } catch (error) {
            console.error('Error during teardown:', error);
          }
        })();
      }
    };
  }, [webcontainerInstance]);

  useEffect(() => {
    if (isBuilding && !webcontainerInstance) {
      const bootWebContainer = async () => {
        try {
          if (webcontainerInstance) {
            await webcontainerInstance.teardown();
          }

          setLoadingState('Initializing development environment...');
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const wc = await WebContainer.boot();
          setWebcontainerInstance(wc);
          setLoadingState('Setting up project files...');

          await wc.mount({
            'index.html': {
              file: {
                contents: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin">
                      <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp">
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
                    "scripts": {
                      "start": "vite",
                      "build": "vite build",
                      "serve": "vite preview"
                    },
                    "dependencies": {
                      "react": "^18.2.0",
                      "react-dom": "^18.2.0"
                    },
                    "devDependencies": {
                      "@vitejs/plugin-react": "^4.0.0",
                      "vite": "^4.3.9"
                    }
                  }
                `
              }
            }
          });

          setLoadingState('Installing dependencies...');
          await wc.installDependencies();
          
          setLoadingState('');
        } catch (error) {
          console.error('Failed to boot WebContainer:', error);
          toast({
            title: "Error",
            description: "Failed to initialize the development environment. Please try refreshing the page.",
            variant: "destructive"
          });
          setLoadingState('');
          setIsBuilding(false);
        }
      };

      bootWebContainer();
    }
  }, [isBuilding, webcontainerInstance]);

  const handleSubmit = (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'I\'ll help you build that. Let me start the process...'
    }]);
    setIsBuilding(true);
  };

  return (
    <div className="fixed inset-0 w-full">
      <div className="absolute inset-0 -z-10">
        <Squares 
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333" 
          hoverFillColor="#222"
        />
      </div>
      
      <div className="flex h-screen">
        <div className="flex-1">
          {isBuilding ? (
            <ResizablePanelGroup direction="horizontal" className="h-screen">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-screen flex flex-col border-r border-neutral-800">
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                          <span className="text-sm text-white">
                            {message.role === 'assistant' ? 'ONE|X' : 'you'}
                          </span>
                        </div>
                        <div className={`relative flex-1 rounded-lg p-4 ${
                          message.role === 'assistant' 
                            ? 'bg-neutral-900/50 text-neutral-200' 
                            : 'bg-blue-600/20 text-blue-200'
                        }`}>
                          <GlowingEffect
                            spread={40}
                            glow={true}
                            disabled={false}
                            proximity={64}
                            inactiveZone={0.01}
                            borderWidth={2}
                          />
                          <p className="text-sm relative z-10">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-neutral-800">
                    <div className="relative w-full rounded-xl">
                      <GlowingEffect
                        spread={40}
                        glow={true}
                        disabled={false}
                        proximity={64}
                        inactiveZone={0.01}
                        borderWidth={2}
                      />
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
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-screen relative p-4">
                  {loadingState && (
                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-10 rounded-xl">
                      <div className="text-white text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 border-neutral-700 rounded-full mb-4 mx-auto"></div>
                        <p>{loadingState}</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    id="webcontainer-iframe"
                    className="w-full h-full bg-neutral-900 rounded-xl border border-neutral-800"
                    title="WebContainer Preview"
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div className="relative w-full max-w-2xl rounded-xl">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                  borderWidth={2}
                />
                <VercelV0Chat onSubmit={handleSubmit} inBuildMode={false} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
