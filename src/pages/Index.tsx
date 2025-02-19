import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Squares } from "@/components/ui/squares-background";
import { useState, useEffect } from "react";
import { WebContainer, auth } from '@webcontainer/api';
import { useToast } from "@/components/ui/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/neon-button";
import { useNavigate } from "react-router-dom";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

// Initialize WebContainer auth once, outside of the component
auth.init({
  clientId: 'wc_api_recti_flex_93764cd538c0cd03a80023c1b70fc042',
  scope: '',
});

// Define a type for the secret response
type SecretResponse = {
  secret: string;
}

const Index = () => {
  const [isBuilding, setIsBuilding] = useState(false);
  const [loadingState, setLoadingState] = useState<string>('');
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const generateAppFromPrompt = async (prompt: string) => {
    try {
      setLoadingState('Generating app from your prompt...');
      
      const { data: secretData, error: secretError } = await supabase
        .from('secrets')
        .select('secret')
        .eq('name', 'ANTHROPIC_API_KEY')
        .maybeSingle<SecretResponse>();

      if (secretError || !secretData) {
        throw new Error('Anthropic API key not found. Please ensure you have added it to the secrets table.');
      }

      const ANTHROPIC_API_KEY = secretData.secret;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          messages: [{
            role: 'user',
            content: `Generate a complete React web application based on this prompt: ${prompt}. 
            Return only the necessary files and their content in a JSON format where each key is a file path and each value is the complete file content.
            Include package.json, index.html, and any required React components. The response must be valid JSON that can be parsed with JSON.parse().`
          }],
          system: "You are an expert at creating React applications. Your responses should only contain valid JSON where each key is a file path and each value is the complete file content.",
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Anthropic API Error:', errorData);
        throw new Error(`Failed to generate app: ${errorData.error?.message || 'Unknown error'}`);
      }

      const responseData = await response.json();
      console.log('Claude response:', responseData);

      if (!responseData.content || !responseData.content[0] || !responseData.content[0].text) {
        throw new Error('Invalid response format from Claude');
      }

      const generatedFiles = JSON.parse(responseData.content[0].text);

      if (webcontainerInstance) {
        await webcontainerInstance.teardown();
      }

      setLoadingState('Initializing development environment...');
      const wc = await WebContainer.boot();
      setWebcontainerInstance(wc);

      setLoadingState('Setting up project files...');
      await wc.mount(generatedFiles);

      setLoadingState('Installing dependencies...');
      const installProcess = await wc.spawn('npm', ['install']);
      await installProcess.exit;

      setLoadingState('Starting development server...');
      const startProcess = await wc.spawn('npm', ['start']);
      
      startProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
        }
      }));

      setLoadingState('');
    } catch (error) {
      console.error('Error generating app:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate the application. Please try again.",
        variant: "destructive"
      });
      setLoadingState('');
      setIsBuilding(false);
    }
  };

  const handleSubmit = async (message: string) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: 'I\'ll help you build that. Let me generate the app from your prompt...'
    }]);
    setIsBuilding(true);
    await generateAppFromPrompt(message);
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

      {/* Auth Buttons */}
      <div className="absolute top-4 right-4 flex gap-4 z-50">
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate('/auth')}
          className="text-white hover:text-white"
        >
          Sign In
        </Button>
        <Button
          variant="ghost"
          size="default"
          onClick={() => navigate('/auth?signup=true')}
          className="text-white hover:text-white"
        >
          Sign Up
        </Button>
      </div>
      
      <div className="flex h-screen">
        <div className="flex-1">
          {isBuilding ? (
            <ResizablePanelGroup direction="horizontal" className="h-screen">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-screen flex flex-col border-r border-neutral-800">
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    <div className="mb-4">
                      <AnimatedShinyText className="text-center text-sm text-white">
                        Built by ONE|X Tech
                      </AnimatedShinyText>
                    </div>
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
              <div className="w-full max-w-2xl space-y-4">
                <AnimatedShinyText className="text-center text-sm text-white mb-4">
                  Built by ONE|X Tech
                </AnimatedShinyText>
                <div className="relative rounded-xl">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
