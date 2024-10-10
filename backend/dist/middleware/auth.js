"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserMiddleware = exports.authMiddleware = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const express_jwt_1 = require("express-jwt");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const supabase = (0, supabase_js_1.createClient)('SUPABASE_PROJECT_URL', 'SUPABASE_API_KEY');
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
const setUserMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.sub) {
        try {
            const { data: user, error } = yield supabase
                .from('Users')
                .select('*')
                .eq('supabaseId', req.auth.sub)
                .single();
            if (error)
                throw error;
            req.user = Object.assign(Object.assign({}, user), { id: parseInt(user.id, 10) // Ensure id is a number
             });
        }
        catch (error) {
            console.error('Error fetching user:', error);
        }
    }
    next();
});
exports.setUserMiddleware = setUserMiddleware;
