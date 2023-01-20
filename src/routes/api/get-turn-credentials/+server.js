import twilio from 'twilio'
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "$env/static/private";

export const GET = async () => {
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyloading: true })  
  try {
    const token = await client.tokens.create()
    console.log('twilio token: ', token)
    return new Response(JSON.stringify({ token }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'failed to fetch TURN credentials', error }))    
  }
};
