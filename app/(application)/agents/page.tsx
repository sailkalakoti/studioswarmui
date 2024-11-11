import { RoutinesList } from "@/components/routines-list";
import { NextPage } from "next";
import React from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudioSwarm: Agents',
};

const RoutineListPage: NextPage = () => {
  return (
    <div>
      <RoutinesList page="agents" />
    </div>
  );
};

export default RoutineListPage;
