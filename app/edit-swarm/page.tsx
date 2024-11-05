"use client";

import { CreateSwarm } from "@/components/create-swarm";
import { DnDProvider } from "@/components/DnDContext";
import { ReactFlowProvider } from "@xyflow/react";
import { NextPage } from "next";
import React from "react";

const EditSwarmPage: NextPage = () => {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <CreateSwarm />
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default EditSwarmPage;
