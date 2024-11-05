import { RoutinesList } from "@/components/routines-list";
import { NextPage } from "next";
import React from "react";

const RoutineListPage: NextPage = () => {
  return (
    <div>
      <RoutinesList page="routines" />
    </div>
  );
};

export default RoutineListPage;
