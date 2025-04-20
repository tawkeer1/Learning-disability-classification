// pages/api/analyze.js

import { classifyDisability } from "@/app/backend/classifier";

export const POST = async(req)=> {
    try {
        console.log("inside post api");
        const features = await req.json();  
        console.log("Features received:", features);
      const predictedClass = await classifyDisability(features);  
        console.log("Predicted class:", predictedClass);
      return new Response(JSON.stringify({ prediction: predictedClass }),{status: 200});
    } catch (error) {
      console.log("Got error",error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    }
