import React, { useEffect, useState } from 'react'
import APIs, { endpoints } from '../Config/APIs'
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
  Button
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import formatDate from '../Convert/formatDate '

export interface Props {
  productId: string
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
  urls: string[]
}

const CommentsByProduct = ({ productId }: Props) => {
  const [comments, setComments] = useState<ProductComment[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');

  const getCommentsByProduct = async () => {
    try {
      setLoading(true)
      const query = new URLSearchParams();
      query.append('page', currentPage.toString());
      const res = await APIs.get(`${endpoints['getCommentsByProduct'](productId)}?${query.toString()}`)
      if (res.status !== 200) {
        setError(true)
        setErrorMessage(res.data.message || 'Error loading comments.')
      } else {
        setComments(res.data.commentsWithUrls)
        setTotal(res.data.total || 0);
        setPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err)
      setError(true)
      setErrorMessage('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = { page: newPage.toString() };
      setSearchParams(params);
    }
  };

  useEffect(() => {
    getCommentsByProduct()
  }, [productId, searchParams.toString()])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {errorMessage}
      </Alert>
    )
  }

  return (
    <Box mt={2}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
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
    </Box>
  )
}

export default CommentsByProduct
