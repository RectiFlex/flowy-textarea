
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

export function VercelV0Chat({ onSubmit, inBuildMode }: { onSubmit: (message: string) => void, inBuildMode: boolean }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(input);
      toast({
        title: "Generated!",
        description: "Your app has been generated.",
      });
      setInput("");
    } catch (error: any) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate('/projects')}
          className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
        >
          Projects
        </button>
        {inBuildMode ? (
          <Badge variant="outline">Building</Badge>
        ) : null}
      </div>
      <div className="flex rounded-md border shadow-sm">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Design a landing page for a SaaS product..."
          className="rounded-r-none"
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          className="rounded-l-none"
          disabled={isLoading}
        >
          {isLoading ? <Send className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}
