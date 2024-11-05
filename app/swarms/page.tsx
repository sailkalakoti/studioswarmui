"use client";
import React from "react";
import { RoutinesList } from "@/components/routines-list";
import { NextPage } from "next";

const RoutineListPage: NextPage = () => {
  return (
    <div>
      <RoutinesList page="swarms" />
    </div>
  );
};

export default RoutineListPage;
