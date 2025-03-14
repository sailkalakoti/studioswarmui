"use client";
import React, { useEffect, useState } from "react";
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
import { getChildrenCount, getDifferenceInDaysLabel, useElementOnScreen, useFetchData } from "@/lib/utils";
import CardSkeleton from "./CardSkeleton";
import SortDropdown from "./SortDropdown";
import BreadCrumbs from "./Breadcrumbs";
import constants from "@/constants";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

interface ToBeDeletedItemProps {
  routineid?: string;
  agentid?: string;
  swarmid?: string;
}

interface PaginationTypes {
  current_page: number;
  limit: number;
  total_count: number;
  total_pages: number;
}

interface ListResponse {
  data: [];
  pagination: PaginationTypes
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

const PAGE_SIZE = 10;

export function RoutinesList({ page }: { page: string }) {
  const {
    PAGE_TITLES,
    PAGE_TYPE,
    PAGE_SUBTITLES,
  } = constants;
  const [toBeDeletedItem, setToBeDeletedItem] = useState<ToBeDeletedItemProps>({});
  const queryClient = useQueryClient();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dataToShow, setDataToShow] = useState([]);

  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('asc');
  const [pageNum, setPageNum] = useState<number>(0);

  const { data, isLoading, isFetching }: { data: ListResponse, isLoading: boolean, isFetching: boolean } = useFetchData(`/${page}/`, {
    sort_by: sortBy,
    order: sortOrder,
    limit: PAGE_SIZE,
    skip: pageNum * PAGE_SIZE,
  }, 'json', {
    enabled: true
  }, [`/${page}/`, sortBy, sortOrder, String(pageNum)]);
  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries([`/${page}/`, sortBy, sortOrder, String(pageNum)]);
      toast.success("Deleted " + PAGE_TYPE[page]);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      queryClient.invalidateQueries([`/${page}/`, sortBy, sortOrder, String(pageNum)]);
    }
  })

  const { data: listData = [], pagination } = data || { data: [], pagination: {} };

  const intersectionCb = () => {
    if ((((pageNum + 1) * PAGE_SIZE) < pagination?.total_count) && !isLoading) {
      setPageNum(pageNum + 1);
    }
  };

  const [containerRef] = useElementOnScreen(
    {
      root: null,
      rootMargin: '0px',
      threshold: 1,
    },
    intersectionCb,
  );

  useEffect(() => {
    if (listData?.length) {
      if (pagination.current_page === 1) {
        setDataToShow(listData);
      } else {
        setDataToShow(prevData => prevData?.concat(listData));
      }
    }
  }, [listData, pagination])

  const openDeleteDialog = (routine) => {
    setIsDeleteDialogOpen(true);
    setToBeDeletedItem(routine);
  }

  const onDeleteClick = () => {
    setIsDeleteDialogOpen(false);
    deleteMutation.mutate({
      page,
      id: toBeDeletedItem.routineid || toBeDeletedItem.agentid || toBeDeletedItem.swarmid
    })
  }

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      trickleSpeed: 100,
      minimum: 0.3
    });
  }, []);

  useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isLoading, isFetching]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="mb-4">
          <BreadCrumbs
            path={[
              {
                label: "Dashboard",
                href: "/dashboard",
              },
              {
                label: PAGE_TITLES[page],
                href: `/${page}`,
              }
            ]}
          />
        </div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold product-text-color">
            {PAGE_TITLES[page]}
          </h1>
          <SortDropdown
            onSortChange={(sortBy, sortOrder) => {
              setSortBy(sortBy)
              setSortOrder(sortOrder)
              setPageNum(0);
              setDataToShow([]);
            }}
          />
        </div>
        <Toaster toastOptions={{ position: "bottom-right" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href={`/${page}/create`}>
            <Card className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 transform-gpu translate-y-0 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 hover:border-blue-100">
              <CardContent className="flex flex-col items-center py-8">
                <Plus className="h-12 w-12 text-[#002856] mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Create New {PAGE_TITLES[page]}
                </h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  {PAGE_SUBTITLES[page]}
                </p>
                <Button
                  className="bg-[#0000a9] hover:bg-[#0000d3] text-white"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Link>
          {dataToShow?.map((routine: any) => ({
            ...routine,
            id: routine.routineid || routine.agentid || routine.swarmid
          }))
            ?.map((routine) => {
              const services = getChildrenCount(routine, page);
              const ServiceIcon = services.icon || null;
              return (
                <Link key={routine.routineid || routine.agentid || routine.swarmid} href={`/${page}/${routine.id}`}>
                  <Card className="h-full flex flex-col transform-gpu translate-y-0 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-1 hover:border-blue-100">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
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
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              )
            }
            )}
          {(isLoading || isFetching) && [...new Array(10)]?.map((item) =>
            <CardSkeleton key={item} />
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
        <div className="h-px" ref={containerRef} />
      </main>
    </div>
  );
}
