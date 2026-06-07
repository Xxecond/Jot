import { useState } from "react";
import { createPost } from "@/features/posts/services/postApi";
import { uploadImage } from "../services/uploadApi";

export default function useCreatePost({
  settings,
  addNotification,
  addGuestPost,
  isGuest,
}) {
  const [creating, setCreating] = useState(false);
  
  const submitPost = async ({
    title,
    content,
    selectedFile,
    clearDraft,
    router,
  }) => {
    // show global progress until dashboard finishes fetching
    try {
    setCreating(true);

      if (isGuest) {
        const imageUrl = selectedFile
          ? URL.createObjectURL(selectedFile)
          : null;

        addGuestPost({
          title,
          content,
          image: imageUrl,
        });

        router.push("/dashboard/home");
        return;
      }


    let imageUrl =null;

    if(selectedFile) {
      imageUrl = await uploadImage(selectedFile);
    }

     await createPost({
      title,
      content,
      image: imageUrl,
    })

    if(settings.autoSave){
      clearDraft();
    }

    if(isGuest){
      addGuestPost(data);
    } 
    
    clearDraft();
    router.push("/dashboard/home");
  }
  catch (err){
    addNotification(
      `Error: ${err.message}`,
      "error"
    );
  } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    submitPost,
  };
}