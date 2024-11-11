import React from "react";
import { RoutinesList } from "@/components/routines-list";
import { NextPage } from "next";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudioSwarm: Swarms',
};

const RoutineListPage: NextPage = () => {
  return (
    <div>
      <RoutinesList page="swarms" />
    </div>
  );
};

export default RoutineListPage;
