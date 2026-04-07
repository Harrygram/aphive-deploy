"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Users,
  FileText,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";

const reports = [
  {
    title: "User Report",
    description: "View the growth of user signups over time",
    href: "/admin/userReport",
    icon: Users,
  },
  {
    title: "Post Report",
    description: "View the growth of post creation activity",
    href: "/admin/postReport",
    icon: FileText,
  },
  {
    title: "Community Report",
    description: "View the growth of community creations",
    href: "/admin/communityReport",
    icon: BarChart,
  },
  {
    title: "Comment Report",
    description: "View the growth of comment engagement",
    href: "/admin/commentReport",
    icon: MessageSquare,
  },
  {
    title: "Vote Report",
    description: "View the growth of upvotes and downvotes",
    href: "/admin/voteReport",
    icon: ThumbsUp,
  },
];

export default function ReportsPage() {
  return (
    <>
      {/* Header Section */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Reports</h1>
              <p className="text-sm text-gray-600">
                View and export various analytics reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Grid Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link key={report.href} href={report.href} className="h-full">
                <div className="border rounded-xl p-5 hover:shadow-md transition cursor-pointer flex flex-col gap-3 bg-white min-h-[170px]">
                  <div className="flex items-center gap-3">
                    <report.icon className="w-6 h-6 text-gray-500" />
                    <h2 className="text-lg font-semibold">{report.title}</h2>
                  </div>
                  <p className="text-sm text-gray-600 flex-grow">{report.description}</p>
                  <Button variant="outline" size="sm" className="mt-auto w-fit">
                    View Report
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
