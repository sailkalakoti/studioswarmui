import React from "react";
import { NextPage } from "next";
import { CreateAgentComponent } from "@/components/create-agent";

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
    title: `StudioSwarm: ${isCreate ? 'Create Agent' : 'Update Agent'}`,
  }
}

const RoutinePage: NextPage = async ({ params }: {
  params: Promise<{ id: string }>
}) =>  {
  const { id } = (await params);

  return <CreateAgentComponent id={id} />;
};

export default RoutinePage;
