"use client";

import React from "react";
import { NextPage } from "next";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "@/components/DnDContext";
import { CreateSwarm } from "@/components/create-swarm";

const RoutinePage: NextPage = () => {
  //   const router = useRouter();
  //   const { id } = router.query;

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <CreateSwarm />
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default RoutinePage;
