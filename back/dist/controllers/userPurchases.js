"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchasedCourses = exports.joinCourse = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Join/Subscribe to a course
const joinCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user?.id; // Assuming user ID is available in the request
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        // Check if the course exists
        const course = await prisma.course.findUnique({
            where: { id: parseInt(courseId) }
        });
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        // Check if the user has already purchased the course
        const existingPurchase = await prisma.usersPurchases.findUnique({
            where: {
                UsersId_courseId: {
                    UsersId: userId,
                    courseId: parseInt(courseId)
                }
            }
        });
        if (existingPurchase) {
            res.status(400).json({ error: 'User has already joined this course' });
            return;
        }
        // Create a new purchase record
        const purchase = await prisma.usersPurchases.create({
            data: {
                UsersId: userId,
                courseId: parseInt(courseId)
            }
        });
        res.status(201).json({ message: 'Successfully joined the course', purchase });
    }
    catch (error) {
        console.error('Error joining course:', error);
        res.status(500).json({ error: 'Failed to join course' });
    }
};
exports.joinCourse = joinCourse;
const getPurchasedCourses = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const purchasedCourses = await prisma.usersPurchases.findMany({
            where: {
                UsersId: userId
            },
            include: {
                course: {
                    include: {
                        createdBy: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        const formattedCourses = purchasedCourses.map(purchase => ({
            id: purchase.course.id,
            title: purchase.course.title,
            imageUrl: purchase.course.imageUrl,
            instructor: purchase.course.createdBy.name,
            description: purchase.course.description,
            duration: purchase.course.duration,
            level: purchase.course.level,
            purchasedAt: purchase.purchasedAt
        }));
        res.status(200).json(formattedCourses);
    }
    catch (error) {
        console.error('Error fetching purchased courses:', error);
        res.status(500).json({ error: 'Failed to fetch purchased courses' });
    }
};
exports.getPurchasedCourses = getPurchasedCourses;
