import SettingsPage from "@/components/SettingPage";
import { Metadata, NextPage } from "next";
import React from "react";

export const metadata: Metadata = {
  title: 'StudioSwarm: Settings',
};


const EditSwarmPage: NextPage = () => {
  return (
    <SettingsPage />
  );
};

export default EditSwarmPage;
