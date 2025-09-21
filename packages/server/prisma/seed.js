/**
 * Seed script for MySQL using Prisma Client.
 * Summaries are intentionally left blank (no Summary rows created).
 * Run: node prisma/seed.js  (or via `npx prisma db seed` if you wire package.json)
 */
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

function randomDateInLast(days) {
    const now = new Date();
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return new Date(past.getTime() + Math.random() * (now - past));
}

async function main() {
    console.log("Resetting tables…");
    await prisma.$transaction([
        prisma.review.deleteMany(),
        prisma.summary.deleteMany(), // none will be re-created; ensures a clean slate
        prisma.product.deleteMany(),
    ]);

    console.log("Seeding products + reviews (no summaries)…");
    const productsData = [
        {
            name: "Aurora Headphones",
            description:
                "Wireless over-ear headphones with ANC and ~30h battery life.",
            price: 199.99,
            reviews: {
                create: [
                    {
                        author: "Alice",
                        rating: 5,
                        content: "Crisp sound and comfy for long sessions.",
                        createdAt: randomDateInLast(90),
                    },
                    {
                        author: "Bob",
                        rating: 4,
                        content: "Great ANC; bass a bit heavy out of the box.",
                        createdAt: randomDateInLast(60),
                    },
                ],
            },
        },
        {
            name: "Nimbus Mechanical Keyboard",
            description: "75% hot-swap board with pre-lubed tactile switches.",
            price: 129.0,
            reviews: {
                create: [
                    {
                        author: "Chen",
                        rating: 5,
                        content: "Thocky and compact. Stabilizers are decent.",
                        createdAt: randomDateInLast(45),
                    },
                    {
                        author: "Dana",
                        rating: 3,
                        content: "Nice feel, but the keycaps shine quickly.",
                        createdAt: randomDateInLast(20),
                    },
                    {
                        author: "Eve",
                        rating: 4,
                        content: "South-facing LEDs and QMK are a win.",
                        createdAt: randomDateInLast(10),
                    },
                ],
            },
        },
        {
            name: "Solace Ergonomic Chair",
            description: "Mesh back, 4D armrests, adjustable lumbar.",
            price: 349.5,
            reviews: {
                create: [
                    {
                        author: "Fiona",
                        rating: 5,
                        content: "My back thanks me.",
                        createdAt: randomDateInLast(120),
                    },
                ],
            },
        },
        {
            name: 'Quasar 27" 4K Monitor',
            description: "IPS panel, 144Hz, HDR600, USB-C 90W.",
            price: 529.99,
            reviews: { create: [] }, // exercise zero-review path
        },
        {
            name: "Driftwood Standing Desk",
            description: "Bamboo top, dual-motor, memory presets.",
            price: 429.0,
            reviews: {
                create: [
                    {
                        author: "Gabe",
                        rating: 2,
                        content: "Rocking at max height on carpet.",
                        createdAt: randomDateInLast(15),
                    },
                    {
                        author: "Hana",
                        rating: 4,
                        content: "Quiet motors and solid presets.",
                        createdAt: randomDateInLast(7),
                    },
                ],
            },
        },
        {
            name: "Atlas USB-C Hub",
            description:
                "8-in-1 hub with HDMI 4K60, SD/TF, and 100W PD passthrough.",
            price: 59.99,
            reviews: {
                create: [
                    {
                        author: "Ivy",
                        rating: 4,
                        content: "Everything works; gets slightly warm.",
                        createdAt: randomDateInLast(25),
                    },
                    {
                        author: "Jamal",
                        rating: 5,
                        content: "Great travel companion; no driver issues.",
                        createdAt: randomDateInLast(5),
                    },
                ],
            },
        },
        {
            name: "Borealis 4K Webcam",
            description: "4K30 with dual mics and auto-framing.",
            price: 89.0,
            reviews: {
                create: [
                    {
                        author: "Kai",
                        rating: 4,
                        content: "Sharp image; low light performance is okay.",
                        createdAt: randomDateInLast(40),
                    },
                ],
            },
        },
    ];

    // Create all products with nested reviews (no summaries)
    await prisma.$transaction(
        productsData.map((data) => prisma.product.create({ data }))
    );

    // Quick verification
    const [productsCount, reviewsCount, summariesCount] =
        await prisma.$transaction([
            prisma.product.count(),
            prisma.review.count(),
            prisma.summary.count(),
        ]);

    console.log("--- Verification ---");
    console.log("Products:", productsCount);
    console.log("Reviews :", reviewsCount);
    console.log("Summaries:", summariesCount, "(should be 0)");

    // Print one product with its reviews to visually confirm shape
    const sample = await prisma.product.findFirst({
        include: { reviews: true, summary: true },
        orderBy: { id: "asc" },
    });
    console.log("Sample product (includes reviews, summary should be null):");
    console.dir(sample, { depth: null });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
