import client from '../../client';
import { AuthLoginBody, AuthLoginResponse } from './models';

const endpointBase = '/auth';

const login = async (payload: AuthLoginBody) => {
  const data = await client.post(`${endpointBase}/login`, { json: payload }).json<AuthLoginResponse>();

  return data;
};

const AuthService = {
  login
};
  
export default AuthService;
