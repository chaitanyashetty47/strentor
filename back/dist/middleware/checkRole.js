"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTutorOrAdmin = exports.authMiddleware = void 0;
const client_1 = require("@prisma/client");
const supabaseClient_1 = require("../config/supabaseClient");
// const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_API_KEY!)
const prisma = new client_1.PrismaClient();
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    try {
        // Verify the token
        const { data: { user }, error } = await supabaseClient_1.supabase.auth.getUser(token);
        if (error)
            throw error;
        if (!user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        // Fetch the user's details from your Users table
        const dbUser = await prisma.users.findUnique({
            where: { supabaseId: user.id },
            select: {
                id: true,
                supabaseId: true,
                email: true,
                name: true,
                role: true
            }
        });
        if (!dbUser) {
            res.status(404).json({ error: 'User not found in database' });
            return;
        }
        // Attach user to the request object
        req.user = dbUser;
        next();
    }
    catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
const isTutorOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'TUTOR' || req.user.role === 'ADMIN')) {
        next();
    }
    else {
        res.status(403).json({ error: 'Access denied. Tutor or Admin role required.' });
    }
};
exports.isTutorOrAdmin = isTutorOrAdmin;
