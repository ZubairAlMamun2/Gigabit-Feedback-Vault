import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center min-h-screen items-center h-40">
      <Loader2 className="animate-spin text-purple-500" size={50} />
    </div>
  );
};

export default Loading;
