import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from './models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

// The exact same raw data currently in the frontend, for seeding into Mongo.
// We map the static image paths into strings so we can resolve them cleanly in React later without touching Vite compilation errors.
const rawProjects = [
    {
        id: 1,
        title: "Zenith Finance",
        category: "Fintech Platform",
        description: "Real-time trading dashboard processing $2M+ daily volume. Built with React, WebSocket streams, and D3.js visualizations.",
        tech: ["React", "TypeScript", "D3.js", "WebSocket", "PostgreSQL"],
        image: "/project-zenith.jpg", // Note: The frontend will refer to this directly, or we can use the existing imported assets
        year: "2024",
        color: "#E8C547",
    },
    {
        id: 2,
        title: "Nomad Studio",
        category: "Creative Agency",
        description: "Award-winning agency site with WebGL transitions, 3D product showcases, and an editorial blog engine.",
        tech: ["Next.js", "Three.js", "Sanity CMS", "GSAP", "Vercel"],
        image: "/project-nomad.jpg",
        year: "2023",
        color: "#4AAED9",
    },
    {
        id: 3,
        title: "EcoTrack",
        category: "Climate Tech",
        description: "Carbon footprint tracker serving 50K+ users. ML-powered recommendations with real-time emissions data from IoT sensors.",
        tech: ["Vue", "Python", "TensorFlow", "MongoDB", "AWS"],
        image: "/project-ecotrack.jpg",
        year: "2023",
        color: "#4ADE80",
    },
    {
        id: 4,
        title: "Vaultkey",
        category: "Web3 Security",
        description: "Multi-chain wallet security audit platform. Smart contract analysis with automated vulnerability detection.",
        tech: ["Rust", "Solidity", "React", "GraphQL", "Redis"],
        image: "/project-vaultkey.jpg",
        year: "2022",
        color: "#A78BFA",
    },
];

const seedDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);

        console.log('Clearing existing projects...');
        await Project.deleteMany({});

        console.log('Inserting default projects...');
        await Project.insertMany(rawProjects);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
