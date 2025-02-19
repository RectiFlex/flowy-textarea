import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useCompletion } from "ai/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

export function VercelV0Chat({ onSubmit, inBuildMode }: { onSubmit: (message: string) => void, inBuildMode: boolean }) {
  const navigate = useNavigate();
  const [isPro, setIsPro] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.5);
  const { toast } = useToast();
  const {
    completion,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useCompletion({
    api: "/api/completion",
    onFinish: (prompt: string) => {
      toast({
        title: "Generated!",
        description: "Your app has been generated.",
      });
      onSubmit(prompt);
    },
    onError: (error: Error) => {
      toast({
        title: "Uh oh! Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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
          onChange={handleInputChange}
          placeholder="Design a landing page for a SaaS product..."
          className="rounded-r-none"
        />
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="rounded-l-none"
          isLoading={isLoading}
        >
          {isLoading ? <Send className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </div>
  );
}
