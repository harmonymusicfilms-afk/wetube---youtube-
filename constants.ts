import { Video } from './types';

export const CATEGORIES = ['Gaming', 'Tech', 'Live', 'Cooking', 'Travel', 'Vlog', 'Education', 'Music', 'Sports'];

export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: "Building a Clone of YouTube in 24 Hours!",
    thumbnail: "https://picsum.photos/seed/vid1/640/360",
    channelName: "CodeMaster",
    channelAvatar: "https://picsum.photos/seed/avatar1/100/100",
    views: "1.2M views",
    postedAt: "2 days ago",
    duration: "14:20",
    uploadedAt: "May 12, 2025",
    description: "Join me as I attempt the ultimate coding challenge: rebuilding a video sharing platform from scratch using React, Tailwind, and AI!",
    category: "Tech",
    tags: ["coding", "react", "challenge"],
    visibility: "public"
  },
  {
    id: '2',
    title: "Top 10 Places to Visit in 2025",
    thumbnail: "https://picsum.photos/seed/vid2/640/360",
    channelName: "TravelBug",
    channelAvatar: "https://picsum.photos/seed/avatar2/100/100",
    views: "450K views",
    postedAt: "5 hours ago",
    duration: "10:05",
    uploadedAt: "May 14, 2025",
    description: "From the neon streets of Tokyo to the pristine beaches of Bali, here are the must-visit destinations for your 2025 travel bucket list.",
    category: "Travel",
    tags: ["travel", "2025", "guide"],
    visibility: "public"
  },
  {
    id: '3',
    title: "Lofi Hip Hop Radio - Beats to Relax/Study to",
    thumbnail: "https://picsum.photos/seed/vid3/640/360",
    channelName: "ChilledCow Copy",
    channelAvatar: "https://picsum.photos/seed/avatar3/100/100",
    views: "22k watching",
    postedAt: "LIVE",
    duration: "LIVE",
    uploadedAt: "Live Now",
    description: "24/7 Lofi Hip Hop beats to help you focus, relax, or study. Join our community chat!",
    category: "Live",
    tags: ["lofi", "music", "study"],
    visibility: "public"
  },
  {
    id: '4',
    title: "Delicious Pasta Recipe in 5 Minutes",
    thumbnail: "https://picsum.photos/seed/vid4/640/360",
    channelName: "Chef Mario",
    channelAvatar: "https://picsum.photos/seed/avatar4/100/100",
    views: "89K views",
    postedAt: "1 day ago",
    duration: "05:30",
    uploadedAt: "May 13, 2025",
    description: "Who says good food takes time? Learn how to make this authentic Italian pasta dish in just 5 minutes.",
    category: "Cooking",
    tags: ["food", "recipe", "cooking"],
    visibility: "public"
  },
  {
    id: '5',
    title: "Reviewing the New AI Gadgets",
    thumbnail: "https://picsum.photos/seed/vid5/640/360",
    channelName: "TechTrend",
    channelAvatar: "https://picsum.photos/seed/avatar5/100/100",
    views: "2.1M views",
    postedAt: "3 days ago",
    duration: "18:45",
    uploadedAt: "May 11, 2025",
    description: "We got our hands on the latest AI wearables and smart home devices. Are they worth the hype? Let's find out.",
    category: "Tech",
    tags: ["tech", "ai", "review"],
    visibility: "public"
  },
  {
    id: '6',
    title: "My Morning Routine",
    thumbnail: "https://picsum.photos/seed/vid6/640/360",
    channelName: "LifestyleVlog",
    channelAvatar: "https://picsum.photos/seed/avatar6/100/100",
    views: "300K views",
    postedAt: "1 week ago",
    duration: "12:10",
    uploadedAt: "May 7, 2025",
    description: "Get ready with me! Here's how I start my day to stay productive, healthy, and happy.",
    category: "Vlog",
    tags: ["routine", "lifestyle", "vlog"],
    visibility: "public"
  },
  {
    id: '7',
    title: "How to fix a leaky faucet",
    thumbnail: "https://picsum.photos/seed/vid7/640/360",
    channelName: "DIY Dad",
    channelAvatar: "https://picsum.photos/seed/avatar7/100/100",
    views: "10K views",
    postedAt: "4 years ago",
    duration: "08:22",
    uploadedAt: "Apr 10, 2021",
    description: "Stop that annoying drip! I'll show you how to fix a leaky faucet with just a few common tools.",
    category: "Education",
    tags: ["diy", "home improvement", "tutorial"],
    visibility: "public"
  },
  {
    id: '8',
    title: "Gaming Highlights #42",
    thumbnail: "https://picsum.photos/seed/vid8/640/360",
    channelName: "ProGamer",
    channelAvatar: "https://picsum.photos/seed/avatar8/100/100",
    views: "1.5M views",
    postedAt: "1 day ago",
    duration: "22:15",
    uploadedAt: "May 13, 2025",
    description: "The best plays, fails, and funny moments from this week's streams. Don't forget to like and subscribe!",
    category: "Gaming",
    tags: ["gaming", "highlights", "esports"],
    visibility: "public"
  }
];

export const MODEL_CHAT = "gemini-3-pro-preview";
export const MODEL_IMAGE_GEN = "imagen-4.0-generate-001";
export const MODEL_IMAGE_EDIT = "gemini-2.5-flash-image";