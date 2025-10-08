import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Rating,
  CircularProgress,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardActions
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import  { authApi, endpoints } from '../Config/APIs';
import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';


export interface Props {
  userId: string;
  productId: string;
  loadInfoDetailsOfProduct: () => void;
}

const UserComment = (props: Props) => {
  // const user = useSelector((state: RootState) => state.auth.user)
  const { showNotification } = useNotification()
  const [comment, setComment] = useState({
    content: '',
    rating: 0,
    urls: [] as File[]
  });
  

  const [loading, setLoading] = useState(false);
  const {t} = useTranslation()

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

  const removeImage = (index: number) => {
    setComment(prev => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index)
    }));
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
  const handleCheckIsMakeOrdersAndPaid = async (userId: string, productId: string) => {
    try {
      const res = await authApi.get(`${endpoints['checkIsOrderAndIsPayment']}?userId=${userId}&productId=${productId}`)
      console.log("res.data", res.data)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];
      const public_ids : string[] = []

      if (!handdleCheckUploadImages(comment.urls)) {
        return
      }

      if(!handleValidateRating(comment.rating)) {
        showNotification(t("You have to rating your comment from 1 to 5 stats to submit comment"))
        return
      }

      if (!handleValidateContent(comment.content)) {
        showNotification(t("You have to write content for your comment. Maximum length of comment is 255 characters"))
        return
      }

  
      

      if (!await(handleCheckIsMakeOrdersAndPaid(props.userId, props.productId))) {
        showNotification(t("You must place an order for this product and pay for the order before leaving the review below"), "warning")
        return
      }

        
      for (const file of comment.urls) {
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
      const res = await authApi.post(endpoints.addComment, {
        userId: props.userId,
        productId: props.productId,
        content: comment.content,
        rating: comment.rating,
        urls: uploadedUrls,
        public_ids: public_ids,
      });

      // console.log('Comment added successfully:', res.data);
      if(res.status === 201) {
        setComment({ content: '', rating: 0, urls: [] });
        showNotification(t(`${res.data.message}`), "success");
        props.loadInfoDetailsOfProduct();
      }
      else {
        showNotification(t(`${res.data.message}`), "warning")
      }
    
    } catch (err) {
      console.error('Error adding comment:', err);
      showNotification('Failed to add comment. Please try again.', "error");
    } finally {
      setLoading(false);
    }
  };

return (
  <Box
    component="form"
    onSubmit={addComment}
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
      {t("Leave A Comment")}
    </Typography>

    <Box mb={2}>
      <Typography component="legend">{t("Rating")}</Typography>
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
      label={t("Your Comment")}
      multiline
      rows={4}
      fullWidth
      variant="outlined"
      value={comment.content}
      onChange={handleChange}
      sx={{ mb: 2 }}
    />

    <Button variant="contained" component="label" sx={{ mb: 2 }}>
      {t("Upload Images")}
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
      {comment.urls.map((file, index) => (
        <Grid item xs={4} key={index}>
          <Card sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="100"
              image={URL.createObjectURL(file)}
              alt={`preview-${index}`}
            />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <IconButton onClick={() => removeImage(index)} color="error">
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
      {loading ? t("Submitting...") : t("Submit Comment")}
    </Button>
  </Box>
);

};

export default UserComment;
