import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import {supabase} from '../config/supabaseClient'

// const supabase: SupabaseClient = createClient(
//   process.env.SUPABASE_PROJECT_URL!,
//   process.env.SUPABASE_API_KEY!
// )

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
  const authHeader = req.headers['authorization'];
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7); // Remove 'Bearer ' from the start
    
    try {
      // Verify the token and get user info
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error) throw error;

      if (user) {
        console.log("user info",user);
        const { data: userData, error: userError } = await supabase
          .from('Users')
          .select('*')
          .eq('supabaseId', user.id)
          .single();

        if (userError) throw userError;

        // Combine Supabase user data with your custom user data
        req.user = {
          id: parseInt(userData.id, 10), // Ensure id is a number
          email: user.email,
        };

        console.log("User is: ", req.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  next();
};