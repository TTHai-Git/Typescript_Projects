import React, { useEffect, useState } from 'react';
import Favorite from '../Interface/Favorite';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import APIs, { authApi, endpoints } from '../Config/APIs';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CategoryIcon from '@mui/icons-material/Category';
import StoreIcon from '@mui/icons-material/Store';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { pink, blue, green, deepPurple, red } from '@mui/material/colors';
import { useLocation, useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ArrowBack, SportsCricketOutlined } from '@mui/icons-material';
import { Category } from '../Interface/Category';

const FavoriteList = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [favoriteList, setFavoriteList] = useState<Favorite[]>([]);
   const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('')
  const navigate = useNavigate();
  const location = useLocation()
  

  const getFavoriteProductsList = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (categoryId) query.append('category', categoryId);
      if(searchTerm) query.append('search', searchTerm);
      if(sortBy) query.append('sort', sortBy)
      query.append('page', currentPage.toString());
      const res = await authApi.get(
        `${endpoints['getFavoriteProductsList'](user?._id)}?${query.toString()}`
      );
      setFavoriteList(res.data.results);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (error) {
      console.log(error);
      setFavoriteList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
      try {
        setLoading(true)
        // const res = await axios.get('/v1/categories');
        const res = await APIs.get(endpoints.getCategories)
        setCategories(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false)
      }
    };

  const removeFavorite = async (favoriteId: string) => {
    if (!window.confirm('Are you sure you want to remove this item from favorites?')) return;
    try {
      await authApi.delete(endpoints.deleteFavorite(favoriteId));
      setFavoriteList((prev) => prev.filter((fav) => fav._id !== favoriteId));
    } catch (error) {
      console.log(error);
    }
  };

  const viewProductDetails = (productId: string, type: string) => {
    console.log(type)
    navigate(`/products/${type}/${productId}`, { state: {
      type: type,
      from: location.pathname + location.search
    } });
  };

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = { page: newPage.toString() };
      setSearchParams(params);
    }
  };

  const options = [
    { label: 'Increasing By Price', id: 'price_asc' },
    { label: 'Decrease By Price', id: 'price_desc' },
    { label: 'Latest', id: 'latest' },
    { label: 'Oldest', id: 'oldest' },
    { label: 'A-Z', id: 'az' },
    { label: 'Z-A', id: 'za' },
  ];


  useEffect(() => {
    loadCategories()
  }, [])
  useEffect(() => {
    const newSearchTerm = searchParams.get('search') || '';
    const newSortBy = searchParams.get('sort') || ''
    setSearchTerm(newSearchTerm)
    setSortBy(newSortBy)
    getFavoriteProductsList();
  }, [searchParams.toString()]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress />
      </Box>
    );
  }
  return (
    
    <Box p={4}>
      <Typography variant="h4" mb={4} fontWeight="bold" color="primary">
        Your Favorite Products
      </Typography>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 🔍 Search Bar */}
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSearchParams({
                page: '1',
                category: categoryId,
                sort: sortBy,
                search: searchTerm,
              });
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 2,
          }}
        />
  
        {/* Filter Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* 🏷 Category Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              icon={<CategoryIcon />}
              onClick={() => setSearchParams({ page: '1' })}
              sx={{
                cursor: 'pointer',
                backgroundColor: !categoryId ? 'primary.main' : 'grey.300',
                color: !categoryId ? 'white' : 'black',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  color: 'white',
                },
              }}
            />
            {categories.map((cat) => (
              <Chip
                key={cat._id}
                label={cat.name}
                icon={<CategoryIcon />}
                onClick={() => setSearchParams({ category: cat._id, page: '1' })}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: categoryId === cat._id ? 'primary.main' : 'grey.300',
                  color: categoryId === cat._id ? 'white' : 'black',
                  '&:hover': {
                    backgroundColor: categoryId === cat._id ? 'primary.dark' : 'grey.400',
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
  
          {/* ⬇️ Sort Dropdown */}
          <Autocomplete
            disablePortal
            options={options}
            value={options.find((opt) => opt.id.toString() === sortBy) || null}
            onChange={(event, newValue) => {
              const selectedSort = newValue?.id.toString() || '';
              setSortBy(selectedSort);
              setSearchParams({
                page: '1',
                category: categoryId,
                search: searchTerm,
                sort: selectedSort,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sort By"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SportsCricketOutlined color="secondary" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            sx={{
              width: 300,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 2,
            }}
          />
        </Box>
      </Box>
  
      <Grid container spacing={2}>
        {/* Left Advertisement */}
        <Grid item xs={12} md={2}>
          <Box
            sx={{
              backgroundColor: '#f0f0f0',
              height: '300px',
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              position: 'sticky',
              top: '100px',
            }}
          >
            <Typography variant="h6" color="secondary">Advertisement</Typography>
          </Box>
        </Grid>
        {favoriteList ? <>
          {/* Center Favorite Products */}
          <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            {favoriteList.map((fav) => (
              <Grid item xs={12} sm={6} md={6} key={fav._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 5,
                    position: 'relative',
                    backgroundColor: '#fafafa',
                    transition: '0.3s',
                    height: '100%',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 10,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={fav.product.imageUrl}
                    alt={fav.product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" component="div" noWrap>
                        {fav.product.name}
                      </Typography>
                      <Tooltip title="Favorite" arrow>
                        <FavoriteIcon sx={{ color: pink[500] }} />
                      </Tooltip>
                    </Box>
  
                    <Stack spacing={1} mt={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <DescriptionIcon sx={{ color: deepPurple[400] }} />
                        <Typography variant="body2" color="text.secondary">
                          {fav.product.description}
                        </Typography>
                      </Box>
  
                      <Box display="flex" alignItems="center" gap={1}>
                        <AttachMoneyIcon sx={{ color: green[600] }} />
                        <Typography variant="body2" fontWeight="bold" color="secondary">
                          ${fav.product.price}
                        </Typography>
                      </Box>
  
                      <Box display="flex" alignItems="center" gap={1}>
                        <CategoryIcon sx={{ color: blue[600] }} />
                        <Typography variant="body2" color="text.secondary">
                          Category: {fav.product.category?.name}
                        </Typography>
                      </Box>
  
                      <Box display="flex" alignItems="center" gap={1}>
                        <StoreIcon sx={{ color: blue[800] }} />
                        <Typography variant="body2" color="text.secondary">
                          Vendor: {fav.product.vendor?.name}
                        </Typography>
                      </Box>
  
                      <Box display="flex" alignItems="center" gap={1}>
                        <BrandingWatermarkIcon sx={{ color: pink[600] }} />
                        <Typography variant="body2" color="text.secondary">
                          Brand: {fav.product.brand?.name}
                        </Typography>
                      </Box>
                    </Stack>
  
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                      <Tooltip title="View Details" arrow>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => viewProductDetails(fav.product._id, fav.product.type)}
                        >
                          View
                        </Button>
                      </Tooltip>
  
                      <Tooltip title="Remove Favorite" arrow>
                        <IconButton onClick={() => removeFavorite(fav._id)}>
                          <DeleteIcon sx={{ color: red[500] }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        </> : <>
          <Grid xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={6} key={'none'}>
                <Box textAlign="center" mt={4}>
                  <Typography variant="h5" color="text.secondary">
                    You haven't added any favorites yet!
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid> 
        </>
        }
        {/* Right Advertisement */}
        <Grid item xs={12} md={2}>
          <Box
            sx={{
              backgroundColor: '#f0f0f0',
              height: '300px',
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              position: 'sticky',
              top: '100px',
            }}
          >
            <Typography variant="h6" color="secondary">Advertisement</Typography>
          </Box>
        </Grid>
      </Grid>
  
      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button onClick={() => changePage(1)} disabled={currentPage === 1}>First</Button>
        <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
        <Typography variant="body1">Page {currentPage} of {pages}</Typography>
        <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages}>Next</Button>
        <Button onClick={() => changePage(pages)} disabled={currentPage === pages}>Last</Button>
      </Stack>
    </Box>
  );
  
};

export default FavoriteList;
