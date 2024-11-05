"use client";

import React from "react";
// import { useRouter } from "next/router";
import { NextPage } from "next";
// import { CreateSwarm } from "@/components/create-swarm";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "@/components/DnDContext";
import { PythonEditorComponent } from "@/components/python-editor";

const RoutinePage: NextPage = () => {
  //   const router = useRouter();
  //   const { id } = router.query;

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <PythonEditorComponent />
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default RoutinePage;
