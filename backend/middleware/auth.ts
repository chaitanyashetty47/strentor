import { createClient } from '@supabase/supabase-js';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const supabase = createClient('SUPABASE_PROJECT_URL', 'SUPABASE_API_KEY');

export const authMiddleware = expressjwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://uzifiqyzzwhilevfmsbl.supabase.co/rest/v1/rpc/jwks`
  }) as GetVerificationKey,
  audience: 'authenticated',
  issuer: `https://uzifiqyzzwhilevfmsbl.supabase.co`,
  algorithms: ['RS256']
});

export const setUserMiddleware = async (req: any, res: any, next: any) => {
  if (req.auth?.sub) {
    try {
      const { data: user, error } = await supabase
        .from('Users')
        .select('*')
        .eq('supabaseId', req.auth.sub)
        .single();

      if (error) throw error;

      req.user = {
        ...user,
        id: parseInt(user.id, 10) // Ensure id is a number
      };
      
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  next();
};