"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVerticalIcon, Clock, ArrowUpDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useMutation, useQueryClient } from "react-query";
import axiosInstance from "@/lib/apiService";
import toast, { Toaster } from "react-hot-toast";
import { getChildrenCount, getDifferenceInDaysLabel, useFetchData } from "@/lib/utils";
import CardSkeleton from "./CardSkeleton";
import SortDropdown from "./SortDropdown";

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

const getSortLabel = (label) => {
  const obj = {
    'created_at': 'Date Created',
    'updated_at': 'Last Updated',
    'name': 'Alphabetical Order'
  }

  return obj[label] || '';
}

export function RoutinesList({ page }: { page: string }) {
  const [toBeDeletedItem, setToBeDeletedItem] = useState<ToBeDeletedItemProps>({});
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('asc');

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
  } = useFetchData(`/${page}/?limit=100`, {
    sort_by: sortBy,
    order: sortOrder,
  }, 'json', {
    enabled: true
  }, [`/${page}/?limit=100`, sortBy, sortOrder]);
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

  console.log({ sortBy, sortOrder });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {/* <Header /> */}

      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold product-text-color">
            {titleList[page]}
          </h1>
          <SortDropdown
            onSortChange={(sortBy, sortOrder) => {
              setSortBy(sortBy)
              setSortOrder(sortOrder)
            }}
          />
          {/* <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {getSortLabel(sortBy)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name")}>
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("created_at")}>
                  {getSortLabel('created_at')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("updated_at")}>
                  {getSortLabel('updated_at')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div> */}
        </div>
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
            ?.map((routine) => {
              const services = getChildrenCount(routine, page);
              const ServiceIcon = services.icon || null;
              return (
                <Card key={routine.routineid || routine.agentid || routine.swarmid} className="flex flex-col" >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{routine.name}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MoreVerticalIcon className="cursor" />
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
                    <div className="w-full space-y-2">
                      <div className="flex space-x-4 text-sm text-fontc-productText justify-between">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{getDifferenceInDaysLabel(routine?.created_at)}</span>
                        </div>
                        <div className="flex items-center font-semibold gap-2">
                          {ServiceIcon && <ServiceIcon className="w-4 h-4" />}
                          {services.label}
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full border-[#0000a9] border-[1px] bg-[#ffffff] hover:border-[#0000d3] hover:bg-[#ffffff] text-[#0000a9] hover:text-[#0000d3]"
                      >
                        <Link href={`/${page}/${routine.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            }
            )}
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
