import React from "react";

const Jobs = () => {
  const jobList = [
    { id: 1, title: "Frontend Developer", company: "Tech Corp", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png" }, // React Logo
    { id: 2, title: "React Developer", company: "Code Innovators", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968299.png" }, // JavaScript Logo
    { id: 3, title: "UI Engineer", company: "Design Studio", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968342.png" }, // CSS Logo
    { id: 4, title: "Full Stack Developer", company: "Stack Builders", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968381.png" }, // Node.js Logo
    { id: 5, title: "Web Developer", company: "Web Solutions", logo: "https://cdn-icons-png.flaticon.com/512/5968/5968322.png" }, // HTML Logo
    { id: 6, title: "React Native Developer", company: "Mobile Makers", logo: "https://cdn-icons-png.flaticon.com/512/732/732200.png" }, // Mobile Logo
    { id: 7, title: "Junior Developer", company: "Fresh Start Tech", logo: "https://cdn-icons-png.flaticon.com/512/888/888878.png" }, // Laptop Icon
    { id: 8, title: "Software Engineer", company: "Soft Solutions", logo: "https://cdn-icons-png.flaticon.com/512/906/906324.png" }, // Software Icon
    { id: 9, title: "Application Developer", company: "App Innovators", logo: "https://cdn-icons-png.flaticon.com/512/888/888859.png" }, // App Icon
    { id: 10, title: "Lead React Developer", company: "Tech Leaders", logo: "https://cdn-icons-png.flaticon.com/512/1051/1051277.png" }, // Leadership Icon
  ];

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobList.map((job) => (
        <div
          key={job.id}
          className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4"
        >
          <img
            src={job.logo}
            alt={`${job.title} Logo`}
            className="w-16 h-16"
          />
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-gray-600">{job.company}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Jobs;
