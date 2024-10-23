"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserMiddleware = exports.authMiddleware = void 0;
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const supabaseClient_1 = require("../config/supabaseClient");
// const supabase: SupabaseClient = createClient(
//   process.env.SUPABASE_PROJECT_URL!,
//   process.env.SUPABASE_API_KEY!
// )
exports.authMiddleware = (0, express_jwt_1.expressjwt)({
    secret: jwks_rsa_1.default.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://uzifiqyzzwhilevfmsbl.supabase.co/rest/v1/rpc/jwks`
    }),
    audience: 'authenticated',
    issuer: `https://uzifiqyzzwhilevfmsbl.supabase.co`,
    algorithms: ['RS256']
});
const setUserMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7); // Remove 'Bearer ' from the start
        try {
            // Verify the token and get user info
            const { data: { user }, error } = await supabaseClient_1.supabase.auth.getUser(token);
            if (error)
                throw error;
            if (user) {
                console.log("user info", user);
                const { data: userData, error: userError } = await supabaseClient_1.supabase
                    .from('Users')
                    .select('*')
                    .eq('supabaseId', user.id)
                    .single();
                if (userError)
                    throw userError;
                // Combine Supabase user data with your custom user data
                req.user = {
                    id: parseInt(userData.id, 10), // Ensure id is a number
                    email: user.email,
                };
                console.log("User is: ", req.user);
            }
        }
        catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    next();
};
exports.setUserMiddleware = setUserMiddleware;
