import React from "react";
import { NextPage } from "next";
import { ReactFlowProvider } from "@xyflow/react";
import { DnDProvider } from "@/components/DnDContext";
import { CreateSwarm } from "@/components/create-swarm";
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const id = (await params).id
  const isCreate = id === 'create';
  return {
    title: `StudioSwarm: ${isCreate ? 'Create Swarm' : 'Update Swarm'}`,
  }
}

const RoutinePage: NextPage = async ({ params }: {
  params: Promise<{ id: string }>
}) => {
  const { id } = (await params);

  return (
    <ReactFlowProvider>
      <DnDProvider>
        <CreateSwarm id={id} />
      </DnDProvider>
    </ReactFlowProvider>
  );
};

export default RoutinePage;
