import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Job from "../models/job.model.js";
import Application from "../models/application.model.js";
import Message from "../models/message.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fouz_ki_dukaan";

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected. Clearing existing data...");

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Message.deleteMany({});

    console.log("Existing data cleared. Seeding new data...");

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 12);

    // Create shop owners
    const owners = await User.create([
      {
        fullName: "Ahmed Khan",
        email: "ahmed@fouzstore.com",
        phone: "+91 98765 11111",
        password: hashedPassword,
        role: "owner",
        shopName: "Fouz General Store",
        shopAddress: "Near Charminar, Hyderabad",
        location: "Charminar, Hyderabad",
        bio: "Running a general store for 10 years. Looking for reliable staff.",
      },
      {
        fullName: "Priya Reddy",
        email: "priya@citymart.com",
        phone: "+91 98765 22222",
        password: hashedPassword,
        role: "owner",
        shopName: "City Mart",
        shopAddress: "Banjara Hills Road No. 12, Hyderabad",
        location: "Banjara Hills, Hyderabad",
        bio: "Modern supermarket chain. Hiring cashiers and stock managers.",
      },
      {
        fullName: "Ravi Sharma",
        email: "ravi@quickbites.com",
        phone: "+91 98765 33333",
        password: hashedPassword,
        role: "owner",
        shopName: "Quick Bites",
        shopAddress: "Secunderabad Main Road, Hyderabad",
        location: "Secunderabad, Hyderabad",
        bio: "Fast food restaurant. Need delivery boys and kitchen staff.",
      },
    ]);

    console.log(`Created ${owners.length} owners`);

    // Create job seekers
    const seekers = await User.create([
      {
        fullName: "Mohammed Ali",
        email: "mohammed.ali@email.com",
        phone: "+91 98765 44444",
        password: hashedPassword,
        role: "seeker",
        location: "Charminar, Hyderabad",
        education: "B.Com Graduate",
        bio: "Looking for part-time and full-time opportunities in retail.",
        skills: ["Customer Service", "Sales", "Inventory Management", "Hindi", "Telugu"],
        experience: "6 months retail",
      },
      {
        fullName: "Fatima Khan",
        email: "fatima.khan@email.com",
        phone: "+91 98765 55555",
        password: hashedPassword,
        role: "seeker",
        location: "Banjara Hills, Hyderabad",
        education: "12th Pass",
        bio: "Hardworking and reliable. Looking for cashier or billing jobs.",
        skills: ["Billing", "Customer Service", "Math", "Hindi", "English"],
        experience: "1 year billing",
      },
      {
        fullName: "Ravi Kumar",
        email: "ravi.kumar@email.com",
        phone: "+91 98765 66666",
        password: hashedPassword,
        role: "seeker",
        location: "Secunderabad, Hyderabad",
        education: "10th Pass",
        bio: "Experienced delivery person with own bike.",
        skills: ["Delivery", "Navigation", "Time Management", "Telugu", "Hindi"],
        experience: "2 years delivery",
      },
      {
        fullName: "Priya Sharma",
        email: "priya.sharma@email.com",
        phone: "+91 98765 77777",
        password: hashedPassword,
        role: "seeker",
        location: "Hitech City, Hyderabad",
        education: "BBA Graduate",
        bio: "Fresh graduate looking for entry-level positions in management.",
        skills: ["Management", "Communication", "MS Office", "English", "Hindi"],
        experience: "Fresher",
      },
    ]);

    console.log(`Created ${seekers.length} seekers`);

    // Create jobs
    const jobs = await Job.create([
      {
        title: "Sales Assistant",
        description: "We are looking for a friendly and energetic sales assistant to join our team at Fouz General Store. You will be responsible for customer service, inventory management, and maintaining store cleanliness. Work hours: 9 AM to 9 PM with one hour lunch break.",
        requirements: "Good communication skills in Hindi and Telugu. Basic math skills. Willing to work 9 AM - 9 PM. Local resident preferred. Honest and reliable.",
        location: "Charminar, Hyderabad",
        salaryMin: 8000,
        salaryMax: 12000,
        type: "Full-time",
        experience: "0-1 year",
        category: "Retail",
        tags: ["sales", "retail", "customer-service"],
        owner: owners[0]._id,
        shopName: owners[0].shopName,
        status: "active",
      },
      {
        title: "Cashier",
        description: "City Mart is hiring experienced cashiers. You will handle billing, manage cash register, and assist customers. Must be comfortable with digital payment systems and POS machines.",
        requirements: "Experience with POS systems preferred. Good math skills. Friendly attitude. Ability to handle cash transactions accurately. Basic computer knowledge.",
        location: "Banjara Hills, Hyderabad",
        salaryMin: 10000,
        salaryMax: 15000,
        type: "Full-time",
        experience: "0-2 years",
        category: "Retail",
        tags: ["cashier", "billing", "retail"],
        owner: owners[1]._id,
        shopName: owners[1].shopName,
        status: "active",
      },
      {
        title: "Delivery Boy",
        description: "Quick Bites needs delivery boys for food delivery in Secunderabad area. Must have own two-wheeler and valid driving license. Flexible shifts available.",
        requirements: "Own two-wheeler with valid license. Knowledge of Secunderabad area. Smartphone with internet. Punctual and responsible. Good communication skills.",
        location: "Secunderabad, Hyderabad",
        salaryMin: 12000,
        salaryMax: 15000,
        type: "Full-time",
        experience: "0-1 year",
        category: "Delivery",
        tags: ["delivery", "driving", "food"],
        owner: owners[2]._id,
        shopName: owners[2].shopName,
        status: "active",
      },
      {
        title: "Store Manager",
        description: "Fouz General Store is looking for an experienced store manager to oversee daily operations. You will manage staff, inventory, and customer relations.",
        requirements: "2+ years retail management experience. Leadership skills. Inventory management knowledge. Fluent in Hindi, Telugu, and English. Computer literate.",
        location: "Charminar, Hyderabad",
        salaryMin: 18000,
        salaryMax: 25000,
        type: "Full-time",
        experience: "2+ years",
        category: "Management",
        tags: ["management", "retail", "leadership"],
        owner: owners[0]._id,
        shopName: owners[0].shopName,
        status: "active",
      },
      {
        title: "Part-time Helper",
        description: "Need a part-time helper for evening hours (4 PM - 9 PM) at City Mart. Duties include stocking shelves, cleaning, and assisting customers.",
        requirements: "Available evening hours. Physical fitness for lifting. Basic communication skills. Reliable and punctual.",
        location: "Banjara Hills, Hyderabad",
        salaryMin: 5000,
        salaryMax: 7000,
        type: "Part-time",
        experience: "Fresher",
        category: "Retail",
        tags: ["part-time", "helper", "evening"],
        owner: owners[1]._id,
        shopName: owners[1].shopName,
        status: "active",
      },
      {
        title: "Kitchen Staff",
        description: "Quick Bites needs kitchen staff for food preparation. Training will be provided. Must maintain hygiene standards.",
        requirements: "Basic cooking knowledge preferred. Hygiene conscious. Ability to work in fast-paced environment. Team player.",
        location: "Secunderabad, Hyderabad",
        salaryMin: 10000,
        salaryMax: 14000,
        type: "Full-time",
        experience: "0-1 year",
        category: "Food",
        tags: ["kitchen", "cooking", "food"],
        owner: owners[2]._id,
        shopName: owners[2].shopName,
        status: "active",
      },
    ]);

    console.log(`Created ${jobs.length} jobs`);

    // Create applications
    const applications = await Application.create([
      {
        job: jobs[0]._id,
        applicant: seekers[0]._id,
        owner: owners[0]._id,
        status: "pending",
        coverMessage: "I am very interested in this position. I have 6 months of retail experience and I live very close to Charminar.",
      },
      {
        job: jobs[1]._id,
        applicant: seekers[1]._id,
        owner: owners[1]._id,
        status: "accepted",
        coverMessage: "I have 1 year of billing experience and I am very comfortable with POS systems. I would love to join City Mart.",
        responseMessage: "Congratulations! You are selected. Please join from Monday.",
        respondedAt: new Date(),
      },
      {
        job: jobs[2]._id,
        applicant: seekers[2]._id,
        owner: owners[2]._id,
        status: "rejected",
        coverMessage: "I have 2 years of delivery experience with my own bike. I know Secunderabad very well.",
        responseMessage: "Thank you for applying. We have selected another candidate.",
        respondedAt: new Date(),
      },
      {
        job: jobs[0]._id,
        applicant: seekers[3]._id,
        owner: owners[0]._id,
        status: "pending",
        coverMessage: "I am a fresh BBA graduate looking for my first job. I am eager to learn and work hard.",
      },
    ]);

    console.log(`Created ${applications.length} applications`);

    // Update job application counts
    for (const app of applications) {
      await Job.findByIdAndUpdate(app.job, { $inc: { applicationCount: 1 } });
    }

    // Create some messages
    const conversationId1 = [seekers[0]._id.toString(), owners[0]._id.toString()].sort().join("_");
    const conversationId2 = [seekers[1]._id.toString(), owners[1]._id.toString()].sort().join("_");

    await Message.create([
      {
        conversationId: conversationId1,
        sender: owners[0]._id,
        recipient: seekers[0]._id,
        content: "Hi! We saw your application for Sales Assistant.",
        isRead: true,
      },
      {
        conversationId: conversationId1,
        sender: seekers[0]._id,
        recipient: owners[0]._id,
        content: "Yes, I am very interested in this position.",
        isRead: true,
      },
      {
        conversationId: conversationId1,
        sender: owners[0]._id,
        recipient: seekers[0]._id,
        content: "Great! Can you tell us about your previous experience?",
        isRead: false,
      },
      {
        conversationId: conversationId2,
        sender: owners[1]._id,
        recipient: seekers[1]._id,
        content: "Congratulations! You are selected for the Cashier position.",
        isRead: true,
      },
      {
        conversationId: conversationId2,
        sender: seekers[1]._id,
        recipient: owners[1]._id,
        content: "Thank you so much! When should I join?",
        isRead: true,
      },
    ]);

    console.log("Created messages");

    console.log("\n========================================");
    console.log("  SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================");
    console.log("\nTest Accounts:");
    console.log("  Owner 1: ahmed@fouzstore.com / password123");
    console.log("  Owner 2: priya@citymart.com / password123");
    console.log("  Owner 3: ravi@quickbites.com / password123");
    console.log("  Seeker 1: mohammed.ali@email.com / password123");
    console.log("  Seeker 2: fatima.khan@email.com / password123");
    console.log("  Seeker 3: ravi.kumar@email.com / password123");
    console.log("  Seeker 4: priya.sharma@email.com / password123");
    console.log("\n========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
