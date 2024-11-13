"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

export default function CardSkeleton() {
  return (
      <Card className="flex flex-col">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-6" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full rounded-none" />
        </CardFooter>
      </Card>
    );
}
