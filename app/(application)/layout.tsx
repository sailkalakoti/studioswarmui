import { AppSidebar } from "@/components/DashboardSidebar";
import Header from "@/components/header";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div>
          <SidebarProvider open={false}>
            {/* <SidebarTrigger /> */}
            <AppSidebar />
            <div className="mt-[65px] w-[calc(100%-80px)]">
              {children}
            </div>
          </SidebarProvider>
      </div>
      <footer className="bg-gray-100 border-t border-gray-200 p-4 text-center text-sm text-gray-600">
        <p> &copy; {new Date().getFullYear()} StudioSwarm. All rights reserved.</p>
        <div className="mt-2">
          <Link href="#" className="hover:text-black">
            Terms of Service
          </Link>
          <span className="mx-2">|</span>
          <Link href="#" className="hover:text-black">
            Privacy Policy
          </Link>
          <span className="mx-2">|</span>
          <Link href="#" className="hover:text-black">
            Contact Us
          </Link>
        </div>
      </footer>
    </>
  )
}