import twilio from 'twilio'
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "$env/static/private";

export const GET = async () => {
  // const accountSid = "ACbd051822a344707fd90b94d91d284311"
  // const authToken = "32134c63bc47ca02b5323f66eddf825a"
  // const client = twilio(accountSid, authToken, { lazyloading: true })  

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyloading: true })  
  try {
    const token = await client.tokens.create()
    console.log('twilio token: ', token)
    return new Response(JSON.stringify({ token }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'failed to fetch TURN credentials', error }))    
  }
};
