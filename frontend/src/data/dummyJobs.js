import { hyderabadAreas } from "./hyderabadAreas";

const jobTitles = [
  "Cashier",
  "Cafe Staff",
  "Delivery Helper",
  "Juice Shop Worker",
  "Bakery Worker",
  "Receptionist",
  "Waiter",
  "Kitchen Helper",
  "Shop Assistant",
  "Packing Staff",
];

export const dummyJobs = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  title: jobTitles[index % jobTitles.length],
  company: `Shop ${index + 1}`,
  location: hyderabadAreas[index % hyderabadAreas.length],
  salary: `₹${8000 + index * 200}/month`,
  type: index % 2 === 0 ? "Full Time" : "Part Time",
  verified: index % 3 === 0,
  urgent: index % 5 === 0,
  image: `https://picsum.photos/400/300?random=${index}`,
  description:
    "Looking for hardworking candidates for local shop work in Hyderabad.",
}));

export const filterJobs = (jobs, search) => {
  if (!search) return jobs;

  return jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );
};