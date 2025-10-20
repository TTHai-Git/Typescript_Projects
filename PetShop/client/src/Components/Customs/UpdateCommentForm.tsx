import React, { useEffect, useState} from 'react'
import { authApi, endpoints } from '../../Config/APIs'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Grid, IconButton, Rating, TextField, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { useNotification } from '../../Context/Notification'
import { useTranslation } from 'react-i18next'
import { formatFileSize } from '../../Convert/FormatFileSize'

const UpdateCommentForm = () => {
    const user = useSelector((state: RootState) => state.auth.user)
    const { commentId } = useParams(); // from URL
    const { showNotification } = useNotification()
    const {t} = useTranslation()

    const [comment, setComment] = useState<{
        content: string;
        rating: number;
        urls: (File | { preview: string })[];
        commentDetails_ids: string[];
        }>({
        content: "",
        rating: 0,
        urls: ([]).map((url: string) => ({ preview: url })),
        commentDetails_ids: [],
    });
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()


    const getCommentDetailsOfProduct = async () => {
    try {
      setLoading(true);
      const res = await authApi.get(endpoints.getComment(commentId));
      const data = res.data;

      setComment({
        content: data.content,
        rating: data.rating,
        urls: data.urls.map((url: string) => ({ preview: url })), // Convert strings to preview objects
        commentDetails_ids: data.commentDetails_ids,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateRating = (rating: number) => {
    return rating > 0 && rating <= 5
  }

  const handleValidateContent = (content: string) => {
    return content.length > 0 && content.length < 255
  }

  const handdleCheckUploadImages = (files: File[]) => {
    const MAX_FILES = 5
    const MINIMUM_FILES = 1
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024;


    if (files.length > MAX_FILES) {
      showNotification(t("You can only upload a maximum of five photos for comment"), "warning")
      return false
    }
    
    if (files.length < MINIMUM_FILES) {
      showNotification(t("You have to upload at least one photos for comment"), "warning")
      return false
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > MAX_TOTAL_SIZE)
    {
      showNotification(t("The maximum capacity for uploading photos is 10MB"), "warning")
      return false
    }

    const nonImages = files.find((file) => !file.type.startsWith("image/"))
    if (nonImages) {
      showNotification(t("Only image files are allowed"), "warning")
      return false
    }
   
    return true
    
  }


 const handleSubmitUpdateComment = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    setLoading(true);
    if (!window.confirm('Are you sure you want to update this comment?')) return;

    const newFiles = comment.urls.filter((file) => file instanceof File) as File []

    if (newFiles.length > 0 && !handdleCheckUploadImages(newFiles)) {
      setLoading(false);
      return;
    }

    if(!handleValidateRating(comment.rating)) {
      showNotification(t("You have to rating your comment from 1 to 5 stats to submit comment"))
      setLoading(false);
      return
    }

    if (!handleValidateContent(comment.content)) {
      showNotification(t("You have to write content for your comment. Maximum length of comment is 255 characters"))
      setLoading(false);
      return
    }
    
    const uploadedUrls: string[] = [];
    const public_ids : string[] = []

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET || "");
      formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME || "");
      formData.append("folder", process.env.REACT_APP_FOLDER_CLOUD || "")

      const res = await axios.post(
      `${endpoints['uploadAvatarToCloudinary'](
          process.env.REACT_APP_BASE_CLOUD_URL,
          process.env.REACT_APP_CLOUD_NAME,
          process.env.REACT_APP_DIR_CLOUD,
      )}`,
      formData
      );
      // console.log('res', res)

      uploadedUrls.push(res.data.secure_url);
      public_ids.push(res.data.public_id)      
    }

      const res = await authApi.put(
      endpoints.updateComment(commentId),{
        content: comment.content,
        rating: comment.rating,
        urls: uploadedUrls,
        public_ids: public_ids,
      }
    );

    if (res.status === 200) {
      showNotification(t(`${res.data.message}`), "success");
      navigate(-1)
      
    } else {
      console.error("Error updating comment:", res.data.message);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value, files } = e.target as any;
 
     if (name === 'urls' && files) {
       const selectedFiles = Array.from(files) as File[];
       setComment(prev => ({
         ...prev,
         urls: [...prev.urls, ...selectedFiles]
       }));
     }
      else {
       setComment(prev => ({
         ...prev,
         [name]: value
       }));
     }
   };

    const removeImage = async (index: number, commentDetails_id: string) => {
    try{
        setLoading(true)
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        const image = comment.urls[index];
        // Case 1️⃣: If the image is a new file (not yet saved in DB)
        if (image instanceof File) {
          setComment(prev => ({
            ...prev,
            urls: prev.urls.filter((_, i) => i !== index)
          }));
          showNotification(t("Image was removed from the list"), "success");
          return;
        }

        // Case 2️⃣: If the image is an existing one (already saved in DB with url and file onto cloudinary)
        if (commentDetails_id) {
          const res = await authApi.delete(endpoints.deleteCommentDetails(commentDetails_id))
          if (res.status === 200) {
            showNotification(t(`${res.data.message}`), "success")
            setComment(prev => ({
            ...prev,
            urls: prev.urls.filter((_: any, i: number) => i !== index)
            }));
          } 
          else {
            showNotification(t(`${res.data.message}`), "error")
          }
        }
        
    } catch (error:any) {
      showNotification(t(`${error.response?.data?.message}`), "error")
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getCommentDetailsOfProduct()
  }, [commentId])
  return (
    <Box
      component="form"
      onSubmit={handleSubmitUpdateComment}
      sx={{
        maxWidth: '100%',
        margin: '5% 1%',
        padding: 4,
        border: '1px solid #ddd',
        borderRadius: 3,
        backgroundColor: '#f9f9f9',
        boxShadow: 2
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Leave A Comment
      </Typography>

      <Box mb={2}>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="rating"
          value={Number(comment.rating)}
          onChange={(_, newValue) => {
            setComment(prev => ({ ...prev, rating: newValue || 0 }));
          }}
        />
      </Box>

      <TextField
        name="content"
        label="Your Comment"
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={comment.content}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" component="label" sx={{ mb: 2 }}>
        Upload Images
        <input
          type="file"
          name="urls"
          hidden
          multiple
          accept="image/*"
          onChange={handleChange}
        />
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {comment.urls.map((file: File | { preview: string }, index: number) => (
          <Grid item xs={4} key={index}>
            <Card sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                height="100"
                image={file instanceof File ? URL.createObjectURL(file) : file.preview}

                alt={`preview-${index}`}
                />
                <CardContent>
                  {file instanceof File
                    ? `${index + 1}. ${file.name} - ${formatFileSize(file.size)} - (New photo uploaded)`
                    : `${index + 1}. (Existing image)`}
                </CardContent>


              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton onClick={() => removeImage(index, comment.commentDetails_ids[index])} color="error">
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} />}
      >
        {loading ? 'Submitting...' : 'Submit Comment'}
      </Button>
    </Box>
  );
}
export default UpdateCommentForm
