// Dashboard.jsx
import React, { useState } from "react";

import {
  CirclePlus,
  UserRoundPlus,
  CalendarDays,
  FolderInput,
  Plus,
} from "lucide-react";
export default function Dashboard() {
  function MentorCard({ mentor }) {
    return (
      <div className="bg-white rounded p-3 outline outline-gray-300 ">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 mr-3 flex items-center justify-center rounded-full">
            <img
              src={mentor.image}
              className="w-10 h-10 rounded-full"
              alt={mentor.name}
            />
          </div>
          <div className="text-sm">
            <h2 className="font-semibold">{mentor.name}</h2>
            <span className="text-gray-500 text-[11px]">{mentor.role}</span>
          </div>
        </div>

        <div className="p-2 grid grid-cols-2 gap-2 text-[14px]">
          <button className="bg-blue-500 py-1 rounded text-white hover:scale-[1.01] hover:bg-blue-600 transition-all duration-300 ease-in-out">
            Schedule
          </button>
          <button className="bg-gray-100 py-1 rounded text-black hover:scale-[1.01] hover:bg-gray-50 transition-all duration-300 ease-in-out">
            Message
          </button>
        </div>
      </div>
    );
  }
  const [mentors] = useState([
    {
      id: 1,
      name: "Resty Gonzales",
      role: "Your Mentor",
      image: "./profile.jpg",
    },
    {
      id: 2,
      name: "Jane Dela Cruz",
      role: "Project Advisor",
      image: "./profile.jpg",
    },
    { id: 3, name: "Carl Mendoza", role: "Team Lead", image: "./profile.jpg" },
  ]);
  const visibleMentors = mentors.slice(0, 2);
  const extraCount = mentors.length - 2;

  return (
    <div className="p-3 flex flex-col">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Good Morning, Alex</h1>
        <span className="text-sm">
          Here's a look at your projects, mentorship, and upcoming tasks.
        </span>
      </div>

      {/* GRID: Left & Right */}
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        {/* LEFT SIDE */}

        <div className="mt-4">
          {/* My Projects */}
          <h1 className="mb-3">My projects</h1>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white rounded p-3 outline outline-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h2>Project Alpha</h2>
                <img src="./icon.png" className="w-6 h-6" alt="" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <p>Progress</p>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
            {/* next card project */}
            <div className="bg-white rounded p-3 outline outline-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h2>Project Alpha</h2>
                <img src="./icon.png" className="w-6 h-6" alt="" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <p>Progress</p>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
            </div>
            {/* end card */}
          </div>
          {/* Mentorship Connections */}
          <div className="mt-6">
            <div className="flex items-center mb-3">
              <h1 className="text-lg font-semibold mr-2">
                Mentorship Connections
              </h1>

              {/* Show count only if more than 2 */}
              {extraCount > 0 && (
                <span className="text-sm bg-blue-100 flex items-center text-blue-600 py-1 px-1 rounded cursor-pointer hover:bg-blue-200 transition-all duration-300">
                  <Plus size={10} />
                  {extraCount} more
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {visibleMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}

          <div className="mt-6">
            <h2 className="font-bold text-lg mb-1">Recent Activity</h2>{" "}
            {/* ← tiny gap */}
            <div className="bg-white rounded p-3 outline outline-gray-300">
              <ul className="space-y-3">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <img
                      src="./profile.jpg"
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">Sarah Chen</span>{" "}
                      commented on{" "}
                      <span className="font-semibold">Project Phoenix</span>
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <img
                      src="./profile.jpg"
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-sm">
                      You completed a task in{" "}
                      <span className="font-semibold">Project Alpha</span>
                    </p>
                    <p className="text-xs text-gray-500">5 hours ago</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <img
                      src="./profile.jpg"
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold">Mike Johnson</span> was
                      added to{" "}
                      <span className="font-semibold">Project Neptune</span>
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <h1> Quick Actions</h1>
          <div>
            <div className="grid md:grid-cols-2 gap-2">
              <div
                className="bg-white rounded flex p-2 items-center justify-center flex-col gap-2 outline outline-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50 
             transition-all duration-300 ease-in-out cursor-pointer"
              >
                <CirclePlus size={20} className="text-blue-500" />
                <button className="text-sm">New project</button>
              </div>
              {/* next card project */}
              <div
                className="bg-white rounded flex  items-center justify-center flex-col gap-2 outline outline-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50 
             transition-all duration-300 ease-in-out cursor-pointer"
              >
                <UserRoundPlus size={20} className="text-blue-500" />
                <button className="text-sm">Find mentor</button>
              </div>
              <div
                className="bg-white rounded flex p-2 items-center justify-center flex-col gap-2 outline outline-gray-300 hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50 
             transition-all duration-300 ease-in-out cursor-pointer"
              >
                <CalendarDays size={20} className="text-blue-500" />
                <button className="text-sm">New meeting</button>
              </div>
              <div
                className="bg-white rounded flex  items-center justify-center flex-col gap-2 outline outline-gray-300  hover:shadow-lg hover:scale-[1.01] hover:bg-gray-50 
             transition-all duration-300 ease-in-out cursor-pointer"
              >
                <FolderInput size={20} className="text-blue-500" />
                <button className="text-sm">File upload</button>
              </div>
            </div>
          </div>

          {/* Upcoming / Events */}
          <div className="mt-3">
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-4">
                What's Coming Up
              </h2>
              <div className="rounded-lg bg-card-light dark:bg-card-dark p-4 outline outline-gray-400 dark:border-border-dark">
                <ul className="space-y-4">
                  <li className="flex items-center gap-4">
                    <div className="flex flex-col items-center bg-accent/10 text-accent p-2 rounded">
                      <span className="text-xs font-bold uppercase">NOV</span>
                      <span className="text-lg font-bold">25</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Project Phoenix Sync
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        10:00 AM - Mentorship Call
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex flex-col items-center bg-red-500/10 text-red-500 p-2 rounded">
                      <span className="text-xs font-bold uppercase">NOV</span>
                      <span className="text-lg font-bold">27</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Design Review Deadline
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        Project Alpha
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="flex flex-col items-center bg-accent/10 text-accent p-2 rounded">
                      <span className="text-xs font-bold uppercase">DEC</span>
                      <span className="text-lg font-bold">02</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        1:1 with Sarah Chen
                      </p>
                      <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                        2:30 PM - Mentorship Call
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
