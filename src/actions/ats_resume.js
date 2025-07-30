
import { createClient } from "@supabase/supabase-js";
import { getCandidateDetailsByIDAction } from ".";
const supabaseUrl = 'https://wgjikkcgzyakwfsmvovr.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabaseClient = createClient(supabaseUrl, supabaseKey)

export const atsResume = async (userId) => {
      getCandidateDetailsByIDAction(userId)
        .then((response) => {
          console.log("Candidate details fetched successfully:", response);
          handlePreviewResume(response);
          return response;
        })
        .catch((error) => {
          console.error("Error fetching candidate details:", error);
          alert("An error occurred while fetching your resume.");
        });


      };
        
    export async function handlePreviewResume(currentCandidateDetails) {
    const { data } = supabaseClient.storage
      .from("resumes")
      .getPublicUrl(currentCandidateDetails?.candidateInfo?.resume);

    // const a = document.createElement("a");
    // a.href = data?.publicUrl;
    console.log(data?.publicUrl, "dataPublicUrl");
    // a.setAttribute("download", "Resume.pdf");
    // a.setAttribute("target", "_blank");
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  }

