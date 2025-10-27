import { Pencil, Check, X } from "lucide-react";
import React, { useState } from "react";

function Myprofile() {
  const [roles, setRoles] = useState(["Frontend Developer", "UI/UX Designer"]);
  const [isEditing, setIsEditing] = useState(false);

  const predefinedRoles = [
    "Web Designer",
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Project Manager",
  ];

  const handleSelectRole = (e) => {
    const value = e.target.value;
    if (value && !roles.includes(value)) {
      setRoles([...roles, value]);
    }
    e.target.value = "";
  };

  const handleRemoveRole = (role) => {
    setRoles(roles.filter((r) => r !== role));
  };

  return (
    <div className="p-3 grid grid-cols-1 ">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Good Morning, Alex</h1>
        <span className="text-sm">
          Manage your personal information, skills and mentoring preferences
        </span>
      </div>

      {/* Content */}
      <div className="bg-white p-4">
        <div>
          <h1>Profile information</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 mt-4 items-start">
          {/* LEFT SIDE */}
          <div className="w-full md:w-[200px]">
            <div className="relative w-30 h-30 md:w-40 md:h-40 mx-auto">
              <img
                src="./profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover rounded-full border border-gray-200 shadow-sm"
              />

              {/* Edit icon */}
              <button
                type="button"
                aria-label="Edit profile image"
                className="
                  absolute bottom-1 right-1
                  inline-flex items-center justify-center
                  w-10 h-10 rounded-full
                  text-white
                  bg-blue-400
                  shadow-md
                  hover:scale-105 active:scale-95
                  transition-transform
                  hover:bg-blue-500
                "
              >
                <Pencil size={16} />
              </button>
            </div>

            <p
              className="text-center text-gray-500 mt-2"
              style={{ fontSize: "11px", cursor: "none" }}
            >
              JPEG, PNG. Max size 5MB
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 ">
            {/* DISPLAY MODE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="w-full">
                <p className="font-bold text-gray-800">Full Name</p>
                <input
                  type="text"
                  placeholder="Resty Gonzales"
                  className="px-2 py-1 rounded border focus:outline"
                />
              </div>

              <div>
                <p className="font-bold text-gray-800">Location</p>
                <input
                  type="text"
                  placeholder="Calapan City Oriental Mindoro"
                  className="px-2 py-1 rounded border focus:outline overflow-x-auto"
                />
              </div>

              <div>
                <p className="font-bold text-gray-800">Email</p>
                <p>alex@example.com</p>
              </div>

              <div>
                <p className="font-bold text-gray-800">Profile Link</p>
                <a
                  href="https://yourprofile.com"
                  className="text-indigo-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://yourprofile.com
                </a>
              </div>
              <div>
                <p className="font-bold text-gray-800">Job Title / Role</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              {/* Edit button */}
              {/* <div className="col-span-2 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              </div> */}
            </div>
          </div>
          {/* end right */}
        </div>

        {/* About Me */}
        <div className="mt-3 p-4">
          <h1 className="mb-2 text-gray-800">About Me</h1>

          <textarea
            name="about"
            id="about"
            defaultValue={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem mollitia quae laudantium doloremque magni placeat minus quibusdam ipsam deleniti possimus nisi molestiae eum quasi unde, nemo, deserunt quos architecto quo.`}
            className="
              w-full              
              h-32           
              p-3                  
              border border-gray-300
              rounded-md
              resize-none         
              focus:outline-none
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              text-gray-700
            "
          ></textarea>
        </div>
        {/* end of about me */}
        <div className="p-4 ">
          <h1 className="mb-2 text-gray-800">Skills and Interest</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <p>Technical skills</p>
              <div>
                <p>Eating skills</p>
                <p>Figma skills</p>
                <p>prototyping skills</p>
                {/* Select */}
                <button>Add</button>
              </div>
            </div>
            <div>
              <p>Soft skills</p>
              <div>
                <p>Eating skills</p>
                <p>Figma skills</p>
                <p>prototyping skills</p>
                {/* Select */}
                <button>Add</button>
              </div>
            </div>
            <div>
              <p>Interest skills</p>
              <div>
                <p>Eating skills</p>
                <p>Figma skills</p>
                <p>prototyping skills</p>
                {/* Select */}
                <button>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== MODAL EDIT FORM (Compact Design) ====== */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-md p-4 w-[90%] md:w-[480px] max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-semibold text-gray-800">
                Edit Profile Information
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form className="grid grid-cols-2 gap-2 text-sm">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  defaultValue="Alex Johnson"
                  className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  defaultValue="Manila, Philippines"
                  className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue="alex@example.com"
                  className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Profile Link */}
              <div>
                <label
                  htmlFor="profileLink"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Profile Link
                </label>
                <input
                  type="url"
                  id="profileLink"
                  defaultValue="https://yourprofile.com"
                  className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Job Title / Role — Full Width */}
              <div className="col-span-2">
                <label
                  htmlFor="jobTitle"
                  className="block text-xs font-medium text-gray-600 mb-1"
                >
                  Job Title / Role
                </label>

                <div className="flex flex-wrap gap-1 mb-1">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <select
                  id="jobTitle"
                  onChange={handleSelectRole}
                  className="w-full py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Select a role</option>
                  {predefinedRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save button */}
              <div className="col-span-2 flex justify-end mt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 text-xs text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md transition"
                >
                  <Check size={14} />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Myprofile;
