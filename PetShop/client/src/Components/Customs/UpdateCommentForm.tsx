import React, { useEffect, useState, useTransition } from 'react'
import { authApi, endpoints } from '../../Config/APIs'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { Box, Button, Card, CardActions, CardMedia, CircularProgress, Grid, IconButton, Rating, TextField, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { useLocation, useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { useNotification } from '../../Context/Notification'
import { useTranslation } from 'react-i18next'

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
    const [error, setError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
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
    console.error('Failed to fetch comment:', error);
    setError(true);
    setErrorMessage('Failed to fetch comment data.');
  } finally {
    setLoading(false);
  }
};


 const handleSubmitUpdateComment = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    setLoading(true);
    if (!window.confirm('Are you sure you want to update this comment?')) return;

    const uploadedUrls: string[] = [];
    const public_ids : string[] = []

    for (const file of comment.urls) {
        if(file instanceof File) {
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
    console.error("Error updating comment:", error);
    setError(true);
    setErrorMessage('Something went wrong. Please try again later.');
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
        if (commentDetails_id) {
          const res = await authApi.delete(endpoints.deleteCommentDetails(commentDetails_id))
          if (res.status === 204) {
            setError(false)
            showNotification(t("Image was deleted successfully"), "success")
            setComment(prev => ({
            ...prev,
            urls: prev.urls.filter((_: any, i: number) => i !== index)
        }));
          } 
          else {
            setError(true)
            setErrorMessage(t(`${res.data.message}`))
            showNotification(errorMessage, "error")
          }
        }
        
    } catch (error:any) {
        setError(true)
        setErrorMessage(error.response?.data.message)
        showNotification(errorMessage, "error")
    } finally {
        setLoading(false)
    }
    
  };

  useEffect(() => {
    getCommentDetailsOfProduct()
  }, [])
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
