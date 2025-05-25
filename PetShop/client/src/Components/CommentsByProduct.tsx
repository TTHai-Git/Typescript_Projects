import React, { useEffect, useState } from 'react'
import APIs, { authApi, endpoints } from '../Config/APIs'
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Rating,
  ImageList,
  ImageListItem,
  Stack,
  Button,
  Chip,
  TextField,
  Autocomplete,
  InputAdornment,
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SortIcon from '@mui/icons-material/Sort';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import formatDate from '../Convert/formatDate '
import { useSelector } from 'react-redux'
import { RootState } from '../store'

export interface Props {
  productId: string
  totalRating: number,
  beforeTotalRatingRounded: number,
  loadInfoDetailsOfProduct: () => void
}

interface User {
  _id: string
  username: string
  name: string
  avatar: string
}

interface ProductComment {
  _id: string
  user: User
  content: string
  rating: number
  createdAt: string
  urls: string[],
  commentDetails_ids: string[]
}

const CommentsByProduct = ({ productId, totalRating, beforeTotalRatingRounded, loadInfoDetailsOfProduct}: Props) => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [comments, setComments] = useState<ProductComment[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [sortBy, setSortBy] = useState<string>('Oldest');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const navigate = useNavigate()
  const locaion = useLocation()

  const getCommentsByProduct = async () => {
    try {
      setLoading(true)
      const query = new URLSearchParams();
      if(sortBy) query.append('sortBy', sortBy)
      if (ratingFilter !== null) query.append('rating', ratingFilter.toString());
      query.append('page', currentPage.toString());
      const res = await APIs.get(`${endpoints['getCommentsByProduct'](productId)}?${query.toString()}`)
      // console.log(res.data)
      if (res.status === 200) {
        setComments(res.data.commentsWithUrls)
        setTotal(res.data.total);
        setPages(res.data.pages);
        setError(false)
      }
     
    } catch (error:any) {
      setError(true);
      setErrorMessage(error.response?.data?.message || 'Something went wrong');
      setComments([])
      setTotal(0);
      setPages(0);
    } finally {
      setLoading(false)
    }
  }

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = { page: newPage.toString() };
      if(ratingFilter) params.rating = ratingFilter.toString()
      setSearchParams(params);
    }
  };

  const sortOptions = [
  { label: 'Latest', id: 'latest' },
  { label: 'Oldest', id: 'oldest' },
]

const ratingOptions = [
  { label: '5', value: 5 },
  { label: '4', value: 4 },
  { label: '3', value: 3 },
  { label: '2', value: 2 },
  { label: '1', value: 1 },
  
]

  useEffect(() => {
   
    getCommentsByProduct()
  }, [searchParams.toString()])

  const handleDeleteComment = async (commentId: string) => {
    try {
      setLoading(true)
      if (!window.confirm('Are you sure you want to remove this comment?')) return;
      const res = await authApi.delete(endpoints['deleteComment'](commentId))
      if (res.status === 204) {
        // console.log(res)
        alert("Comment deleted successfully")
        loadInfoDetailsOfProduct()
        getCommentsByProduct()
      }
      else {
        console.error("Error deleting comment:", res.data.message)
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      setError(true)
      setErrorMessage('Something went wrong. Please try again later.')
      
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box mt={2}>
      <Typography variant="h4" gutterBottom>
        Customer Reviews: {total ? `${total}` : '0'} Reviews
      </Typography>
      <Typography variant="h5" gutterBottom>
        Average Rating:
        <Chip
          key={productId}
          label={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <span>{beforeTotalRatingRounded}</span>
              {Array.from({ length: 5 }).map((_, i) => {
                const rating = totalRating ?? 0;
                if (rating === 0) {
                  return <StarBorderIcon key={i} sx={{ color: '#ccc', fontSize: 18 }} />;
                } else if (i + 1 <= Math.floor(rating)) {
                  return <StarIcon key={i} sx={{ color: '#fdd835', fontSize: 18 }} />;
                } else if (i < rating) {
                  return <StarHalfIcon key={i} sx={{ color: '#fdd835', fontSize: 18 }} />;
                } else {
                  return <StarBorderIcon key={i} sx={{ color: '#ccc', fontSize: 18 }} />;
                }
              })}
            </Stack>
          }
        />
      </Typography>  
      
    <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
    mb: 2,
  }}
>
  {/* Rating Filter Chips (left side) */}
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
    {ratingOptions.map((opt) => (
      <Chip
        key={opt.value}
        label={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>{opt.label}</span>
            {Array.from({ length: opt.value }, (_, i) => (
              <StarIcon key={i} sx={{ color: '#fdd835', fontSize: 18 }} />
            ))}
          </Stack>
        }
        variant="outlined"
        color={ratingFilter === opt.value ? 'secondary' : 'default'}
        onClick={() => {
          const newRating = ratingFilter === opt.value ? null : opt.value;
          setRatingFilter(newRating);
          const newParams: any = { page: '1', sortBy };
          if (newRating) newParams.rating = newRating.toString();
          setSearchParams(newParams);
        }}
        clickable
        sx={{
          borderRadius: 2,
          px: 1.5,
        }}
      />
    ))}
    <Chip
        key={null}
        label={
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <span>All</span>
            
          </Stack>
        }
        variant="outlined"
        color={ratingFilter === null ? 'secondary' : 'default'}
        onClick={() => {
          const newRating = null;
          setRatingFilter(newRating);
          const newParams: any = { page: '1', sortBy };
          if (newRating) newParams.rating = newRating;
          setSearchParams(newParams);
        }}
        clickable
        sx={{
          borderRadius: 2,
          px: 1.5,
        }}
      />
  </Box>

  {/* Sort Dropdown (right side) */}
  <Autocomplete
    disablePortal
    options={sortOptions}
    value={sortOptions.find((opt) => opt.id === sortBy) || null}
    onChange={(event, newValue) => {
      const selectedSort = newValue?.id || '';
      setSortBy(selectedSort);
      const params: any = { page: '1' };
      if (ratingFilter) params.rating = ratingFilter.toString();
      if (selectedSort) params.sortBy = selectedSort;
      setSearchParams(params);
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Sort by"
        size="small"
        InputProps={{
          ...params.InputProps,
          startAdornment: (
            <InputAdornment position="start">
              <SortIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    )}
    sx={{
      minWidth: 200,
      bgcolor: 'white',
      borderRadius: 2,
      boxShadow: 1,
    }}
  />
</Box>

            
      {error ? <>
        <Alert severity="info" sx={{ mt: 2 }}>
         {errorMessage}
        </Alert>
      </>: <>
      {/* Comments List */}
      <Grid container spacing={2}>
        {comments.map((comment) => (
          <Grid item xs={12} key={comment._id}>
            <Card sx={{ backgroundColor: '#fefefe', borderRadius: 3, boxShadow: 4 }}>
              <CardHeader
                avatar={<Avatar src={comment.user.avatar} alt={comment.user.name} />}
                title={comment.user.name}
                subheader={formatDate(comment.createdAt)}
              />
              <CardContent>
                <Rating value={comment.rating} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {comment.content}
                </Typography>
                {comment.urls?.length > 0 && (
                    <ImageList
                    cols={comment.urls.length < 3 ? comment.urls.length : 3}
                    gap={4} // reduced from 8
                    sx={{
                        mt: 1,
                        justifyContent: 'flex-start',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                    >
                    {comment.urls.map((url, idx) => (
                        <ImageListItem key={idx} sx={{ mr: 1 }}>
                        <img
                            src={url}
                            alt={`comment-img-${idx}`}
                            loading="lazy"
                            style={{
                            borderRadius: 8,
                            objectFit: 'cover',
                            width: '100px',
                            height: '100px',
                            }}
                        />
                        </ImageListItem>
                    ))}
                    </ImageList>

                    )}

              </CardContent>
              {user && user._id === comment.user._id && (
                <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteComment(comment._id)}>
                    Delete
                  </Button>
                  <Button variant="outlined" color="info" onClick={() => navigate(`/comments/${comment._id}/update`,{ state: {
                    from: locaion.pathname + locaion.search,
                  } })}>
                    Update
                  </Button>
                </Stack>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button onClick={() => changePage(1)} disabled={currentPage === 1}>First</Button>
        <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
        <Typography variant="body1">Page {currentPage} of {pages}</Typography>
        <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages}>Next</Button>
        <Button onClick={() => changePage(pages)} disabled={currentPage === pages}>Last</Button>
      </Stack>
      </> }
      
    </Box>
  )
}

export default CommentsByProduct
