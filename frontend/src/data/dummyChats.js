export const dummyConversations = [
  {
    _id: "1",
    fullName: "Nice Juice Center",
    lastMessage: "Can you come tomorrow?",
    time: "10:30 PM",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    _id: "2",
    fullName: "Hyderabad Bakery",
    lastMessage: "Salary is negotiable",
    time: "9:15 PM",
    online: false,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

const messages = {
  1: [
    {
      _id: "m1",
      sender: "owner",
      text: "Hi, are you interested in the job?",
      time: "10:00 PM",
    },
    {
      _id: "m2",
      sender: "user",
      text: "Yes sir, I am interested.",
      time: "10:05 PM",
    },
  ],

  2: [
    {
      _id: "m3",
      sender: "owner",
      text: "Do you have previous experience?",
      time: "9:00 PM",
    },
  ],
};

export const getConversationMessages = (id) => {
  return messages[id] || [];
};