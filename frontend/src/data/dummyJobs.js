import { hyderabadAreas } from "./hyderabadAreas";

const nearbyAreasMap = {
  Tolichowki: ["Mehdipatnam", "Shaikpet"],
  Gachibowli: ["Madhapur", "Kondapur"],
  Kukatpally: ["KPHB", "Moosapet"],
};

const companies = [
  "Al Madina Cafe",
  "Royal Bakery",
  "Fresh Mart",
  "Hyderabad Juice Center",
  "Lucky Kirana",
];

const jobTitles = [
  "Cashier",
  "Cafe Staff",
  "Delivery Boy",
  "Receptionist",
  "Shop Assistant",
  "Waiter",
];

const jobTypes = [
  "full-time",
  "part-time",
  "internship",
];

export const dummyJobs = Array.from(
  { length: 120 },
  (_, index) => {
    const location =
      hyderabadAreas[
        index % hyderabadAreas.length
      ];

    return {
      id: index + 1,

      title:
        jobTitles[index % jobTitles.length],

      company:
        companies[index % companies.length],

      shopName:
        companies[index % companies.length],

      location,

      nearbyAreas:
        nearbyAreasMap[location] || [],

      salaryMin: 8000 + index * 100,

      salaryMax: 12000 + index * 100,

      salary: `₹${8000 + index * 100}/month`,

      type:
        jobTypes[index % jobTypes.length],

      verified: index % 2 === 0,

      urgent: index % 5 === 0,

      image: `https://picsum.photos/400/300?random=${index}`,

      description:
        "Looking for hardworking candidates for local shop work in Hyderabad.",

      requirements:
        "Basic communication skills.",

      experience:
        index % 2 === 0
          ? "Fresher"
          : "1 Year Experience",
    };
  }
);