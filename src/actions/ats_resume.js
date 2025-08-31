import { supabaseClient } from "../lib/supabaseClient";
import { getCandidateDetailsByIDAction } from ".";
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export const atsResume = async (userId, jobDescription) => {
  console.log("atsResume action called with userId:", userId);

  try {
    const response = await getCandidateDetailsByIDAction(userId);
    console.log("Candidate details fetched successfully:", response);
    const resumePreviewResponse = await handlePreviewResume(response,
      jobDescription);
    return resumePreviewResponse;
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    alert("An error occurred while fetching your resume.");
    throw error;
  }
};

export async function handlePreviewResume(currentCandidateDetails, jobDescription) {
  const { data } = supabaseClient.storage
    .from("resumes")
    .getPublicUrl(currentCandidateDetails?.candidateInfo?.resume);
  console.log(data?.publicUrl, "dataPublicUrl");
  if (!data?.publicUrl) {
    console.error("No public URL found for the resume.");
    return null;
  }
  console.log("jd",jobDescription);
  const score = await main({
    prompt: ` Act as an expert AI-powered Applicant Tracking System (ATS).
Extract all key requirements from the Job Description, including mandatory skills, preferred skills, years of experience, and educational background.
Thoroughly parse the candidate's information from the Resume Link.
Calculate a compatibility score by comparing the resume against the job description. Weight mandatory requirements more heavily than preferred ones.
Your entire response must be only the final integer score. Do not include any text, explanations, or the '%' symbol. give above 10 and less then 95 
Resum Link: ${data?.publicUrl} and score it out of 100 based solely on this job description: ${jobDescription}.
Strictly evaluate these criteria:
1. Relevance to Job Description: How well the resume matches the exact job requirements.
2. Keywords: Precise presence and matching of relevant keywords from the job description—be extremely accurate, checking for exact terms, synonyms only if directly implied, and penalize heavily for missing key phrases.
3. Skills and Experience: Appropriateness and direct alignment of listed skills and experience to the job.
4. Clarity and Formatting: Overall readability, organization, and professional structure of the resume.
    `,
  });
  const val=Number(score);
  // console.log(val, "val");
  console.log("Resume analysis score:", score);
  return {data:data?.publicUrl,score:val};
}

async function main({ prompt }) {
  try {
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    maxOutputTokens:100,
    config:{
      responseMimeType: "application/json",
      responseSchema:{
        type:"integer",
        minimum:10,
        maximum:95
      }
    }
    
  });
  // console.log(response.text);
  return response.text;
    
  } catch (error) {
    console.error("Error generating content with AI:", error);
    return 0;
  }

}

// await main();
