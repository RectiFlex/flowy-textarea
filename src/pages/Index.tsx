
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import { Squares } from "@/components/ui/squares-background";
import { useState } from "react";

const Index = () => {
  const [isBuilding, setIsBuilding] = useState(false);

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
          <div className="w-1/2 h-full overflow-auto border-r border-neutral-800 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <VercelV0Chat onSubmit={() => {}} />
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
            <VercelV0Chat onSubmit={() => setIsBuilding(true)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
