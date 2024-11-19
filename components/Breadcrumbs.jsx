"use client";

import React from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';


export default function BreadCrumbs({ path = [] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path?.map((item, index) => {
          if (index !== (path.length - 1))
            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={item?.href}>{item?.label}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            );

          return (
            <BreadcrumbItem>
              <BreadcrumbPage>{item?.label}</BreadcrumbPage>
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
