"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVerticalIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "@/lib/apiService";
import toast, { Toaster } from "react-hot-toast";
import { useFetchData } from "@/lib/utils";
import CardSkeleton from "./CardSkeleton";

interface ToBeDeletedItemProps {
  routineid?: string;
  agentid?: string;
  swarmid?: string;
}

const deleteItem = async (payload) => {
  const endPoint = payload.page;
  const { data } = await axiosInstance.delete('/' + endPoint + '/' + payload.id);
  return data;
}

export function RoutinesList({ page }: { page: string }) {
  const [toBeDeletedItem, setToBeDeletedItem] = useState<ToBeDeletedItemProps>({});
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (routine) => {
    setIsDeleteDialogOpen(true);
    setToBeDeletedItem(routine);
  }

  const titleList = {
    routines: "Routines",
    agents: "Agents",
    swarms: "Swarms",
  };

  const pageType = {
    routines: "Routine",
    agents: "Agent",
    swarms: "Swarm",
  }

  const { data = [], isLoading }: {
    data: [];
    isLoading: boolean;
  } = useFetchData(`/${page}/?limit=100`);
  console.log({ isLoading });
  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`/${page}/?limit=100`);
      toast.success("Deleted " + pageType[page]);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      queryClient.invalidateQueries(`/${page}/?limit=100`);
    }
  })

  const onDeleteClick = () => {
    setIsDeleteDialogOpen(false);
    deleteMutation.mutate({
      page,
      id: toBeDeletedItem.routineid || toBeDeletedItem.agentid || toBeDeletedItem.swarmid
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* <Header /> */}

      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold product-text-color mb-8">
          {titleList[page]}
        </h1>
        <Toaster toastOptions={{ position: "bottom-right" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <Card className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center py-8">
              <Plus className="h-12 w-12 text-[#002856] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create New {titleList[page]}
              </h3>
              <p className="text-sm text-gray-600 text-center mb-4">
                Design a new automated workflow for your AI agents
              </p>
              <Button
                asChild
                className="bg-[#0000a9] hover:bg-[#0000d3] text-white"
              >
                <Link href={`/${page}/create`}>Get Started</Link>
              </Button>
            </CardContent>
          </Card>
          {isLoading && [...new Array(10)]?.map((item) => 
            <CardSkeleton key={item} />
          )}
          {!isLoading && data?.map((routine: any) => ({
            ...routine,
            id: routine.routineid || routine.agentid || routine.swarmid
          }))
            ?.map((routine) => (
              <Card key={routine.routineid || routine.agentid || routine.swarmid} className="flex flex-col" >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{routine.name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVerticalIcon className="cursor"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem >
                          <p className="w-full" onClick={() => openDeleteDialog(routine)}>Delete</p>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-gray-600 mb-4">
                    {routine.description}
                  </p>
                  {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Last run: {routine.lastRun}</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart className="h-4 w-4 mr-1" />
                    <span>Success: {routine.successRate}</span>
                  </div>
                </div> */}
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    className="w-full border-[#0000a9] border-[1px] bg-[#ffffff] hover:border-[#0000d3] hover:bg-[#ffffff] text-[#0000a9] hover:text-[#0000d3]"
                  >
                    <Link href={`/${page}/${routine.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px] gap-[unset]">
              <DialogHeader>
                <DialogTitle>Delete Routine</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="">
                  Are you sure you want to delete this routine?
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={onDeleteClick}
                  variant={'primary'}
                  tabIndex={-1}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  variant={'secondary'}
                >
                  No
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
