import { RoutinesList } from "@/components/routines-list";
import { NextPage } from "next";
import React from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudioSwarm: Routines',
};

const RoutineListPage: NextPage = () => {
  return (
    <div>
      <RoutinesList page="routines" />
    </div>
  );
};

export default RoutineListPage;
