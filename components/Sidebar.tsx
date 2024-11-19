import React from "react";
import { useDnD } from "./DnDContext";
import { Button } from "./ui/button";
import Link from "next/link";
import Logo from "./Logo";

export const Sidebar = () => {
  const { setType } = useDnD();

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string,
  ) => {

    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex flex-col gap-2 p-4 min-w-80 bg-stone-100 border-r border-stone-200 shadow-md">
      <Link href="/" className="mb-8">
        <Logo color="brand" />
      </Link>
      <div className="text-sm mb-4">
        You can drag these nodes to the pane on the right.
      </div>
      <Button
        onDragStart={(event) => onDragStart(event, "chatInput")}
        variant="outline"
        size="lg"
        draggable
      >
        Chat Input Node
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "prompt")}
        variant="outline"
        size="lg"
        draggable
      >
        Prompt Node
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "openai")}
        variant="outline"
        size="lg"
        draggable
      >
        OpenAI Node
      </Button>
      <Button
        onDragStart={(event) => onDragStart(event, "chatOutput")}
        variant="outline"
        size="lg"
        draggable
      >
        OpenAI Node
      </Button>
    </aside>
  );
};
