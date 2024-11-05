"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Github, MessageCircle, Twitter } from "lucide-react";
import Logo from "./Logo";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/">
            <Logo color="brand" />
          </Link>
          {/* <nav>
            <ul className="flex py-2 mt-2 space-x-6 items-center">
              <li>
                <Link href="/" className="text-[#ff7070] hover:text-[#ff5555]">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-900 hover:text-[#ff7070]"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/routines"
                  className="text-gray-900 hover:text-[#ff7070]"
                >
                  Routine List
                </Link>
              </li>
            </ul>
          </nav> */}
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="bg-white text-[#ff7070] border border-[#ff7070] rounded-full px-4 py-2 hover:bg-[#ff7070] hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-5xl font-bold mb-4">
              The Leading
              <br />
              <span className="text-[#ff7070]">Multi-Agent</span> Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline workflows across industries with powerful AI agents.
              <br />
              Build and deploy automated workflows using any LLM and
              <br />
              cloud platform.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-[#ff7070] text-white rounded-full px-6 py-3 hover:bg-[#ff5555]"
              >
                Start Free Trial
              </Link>
              <Link
                href="#"
                className="bg-white text-[#ff7070] border border-[#ff7070] rounded-full px-6 py-3 hover:bg-[#ff7070] hover:text-white"
              >
                I Want A Demo
              </Link>
            </div>
          </div>
          <div className="flex">
            <Image
              src="/integrations.webp?height=720&width=720"
              alt={`Integrations`}
              width={720}
              height={720}
            />
            {/* {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <Image src="/placeholder.svg?height=60&width=60" alt={`Integration ${i + 1}`} width={60} height={60} />
              </div>
            ))} */}
          </div>
        </div>

        <div className="text-center my-16">
          <h2 className="text-6xl font-bold text-[#ff7070]">100,000,000+</h2>
          <p className="text-xl text-gray-600">
            Multi-Agent Crews run using StudioSwarm
          </p>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-2xl font-semibold mb-8">
            Trusted By Industry Leaders
          </h3>
          <div className="flex justify-center space-x-8">
            {["Oracle", "KPMG", "Accenture", "PWC", "Deloitte", "Aurecon"].map(
              (company, index) => (
                <div key={company} className="w-32">
                  <Image
                    src={`/l-placeholder-${index + 1}.svg?height=40&width=120`}
                    alt={company}
                    width={120}
                    height={40}
                  />
                </div>
              ),
            )}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            The <span className="text-[#ff7070]">Complete</span> Platform for
            <br />
            Multi-Agent Automation
          </h2>
          <div className="flex flex-col lg:flex-row mt-12">
            <div className="lg:w-1/2 text-left mb-8 lg:mb-0">
              <h3 className="text-2xl font-semibold mb-4">1. Build Quickly</h3>
              <p className="text-gray-600">
                Start by using StudioSwarm&apos;s framework or UI Studio to
                build your multi-agent automations—whether coding from scratch
                or leveraging our no-code tools and templates.
              </p>
            </div>
            <div className="lg:w-1/2">
              <Image
                src="/workflow.png?height=400&width=600"
                alt="Build Quickly"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-6">Evaluate Your Use Case</h2>
          <div className="w-16 h-1 bg-[#ff7070] mb-8"></div>
          <form>
            <h3 className="text-xl font-semibold mb-4">
              1. What type of use case are you envisioning?
            </h3>
            <div className="space-y-4">
              {[
                "Qualitative Content (Ex: Marketing, Entertainment, etc.)",
                "Qualitative + Quantitative Mix (Ex: Sales, New Features, Hiring, etc.)",
                "High Precision (Ex: Business Processes, etc)",
                "Very High Precision (Ex: Accounting, Financial Models, etc.)",
              ].map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <input
                    type="radio"
                    name="use-case"
                    className="form-radio text-[#ff7070]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="mt-6 bg-[#ff7070] text-white rounded-full px-6 py-2 hover:bg-[#ff5555]"
            >
              Next
            </button>
          </form>
          <div className="mt-8 bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <span>Need Help or Have a Question?</span>
            <Link
              href="#"
              className="text-[#ff7070] hover:text-[#ff5555] flex items-center"
            >
              Talk to Sales <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>

        <div className="text-center bg-gray-900 text-white py-16 rounded-lg mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-[#ff7070]">Ready to start</span> using
            <br />
            multi-agent systems in production?
          </h2>
          <div className="flex justify-center space-x-4 mt-8">
            <Link
              href="#"
              className="bg-[#ff7070] text-white rounded-full px-6 py-3 hover:bg-[#ff5555]"
            >
              Start Free Trial
            </Link>
            <Link
              href="#"
              className="bg-transparent text-white border border-white rounded-full px-6 py-3 hover:bg-white hover:text-gray-900"
            >
              I Want A Demo
            </Link>
          </div>
        </div>
      </main>

      {/* <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <Logo color="white" />
            </div>
            <div>
              <h4 className="font-semibold mb-4">Site</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-[#ff7070]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#ff7070]">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/routines" className="hover:text-[#ff7070]">
                    Routines
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-[#ff7070]">
                    The Framework
                  </Link>
                </li>
                <li>
                  <Link href="/create-swarm" className="hover:text-[#ff7070]">
                    Create Swarm
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#ff7070]">
                    Join our Forum
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-[#ff7070]">
                    Chat With Our Docs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#ff7070]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#ff7070]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between items-center">
            <p>
              &copy; Copyright 2024, All Rights Reserved by StudioSwarm™, Inc.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-[#ff7070]">
                <Github size={24} />
              </Link>
              <Link href="#" className="hover:text-[#ff7070]">
                <MessageCircle size={24} />
              </Link>
              <Link href="#" className="hover:text-[#ff7070]">
                <Twitter size={24} />
              </Link>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
