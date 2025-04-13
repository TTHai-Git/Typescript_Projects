import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Box,
  Button,
  Stack,
  Autocomplete,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Info as InfoIcon,
  LabelOutlined as LabelOutlinedIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  Factory as FactoryIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';

import { useNavigate, useSearchParams } from 'react-router-dom';
import Product from '../Interface/Product';
import { Category } from '../Interface/Category';
import '../Assets/CSS/Pagination.css';
import { useCart } from '../Context/Cart';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');


  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (categoryId) query.append('category', categoryId);
      if (searchTerm) query.append('search', searchTerm);
      if (sortBy) query.append('sort', sortBy);
      query.append('page', currentPage.toString());
  
      const res = await axios.get(`/v1/products?${query.toString()}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await axios.get('/v1/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const newSearchTerm = searchParams.get('search') || '';
    const newSortBy = searchParams.get('sort') || '';
    setSearchTerm(newSearchTerm);
    setSortBy(newSortBy);
    loadProducts();
  }, [searchParams.toString()]);

  useEffect(() => {
    loadCategories();
  }, []);

  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = { page: newPage.toString() };
      if (categoryId) params.category = categoryId;
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
  
 
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Product List: {total} Products
      </Typography>

      
      <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
  {/* 🔍 Search Bar - Top Center */}
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

  {/* Filter Row: Category on Left, Sort on Right */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-start' }}>
    {/* 🏷 Category Chips - Left-aligned */}
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

    {/* ⬇️ Sort Dropdown - Right-aligned */}
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
                <SortIcon color="secondary" />
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

      

      {/* Product Cards */}
      <Grid container spacing={3}>
        {products.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar
                  variant="rounded"
                  src={item.imageUrl}
                  alt={item.name}
                  sx={{ width: 80, height: 80 }}
                />
                <Box>
                  <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    <LabelOutlinedIcon fontSize="small" /> {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <ChatBubbleOutlineIcon fontSize="small" /> {item.description}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <AttachMoneyIcon fontSize="small" /> {item.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <CardContent>
                <Chip icon={<CategoryIcon />} label={`Category: ${item.category?.name}`} sx={{ mr: 1, mb: 1 }} />
                <Chip icon={<FactoryIcon />} label={`Brand: ${item.brand?.name}`} sx={{ mr: 1, mb: 1 }} />
                <Chip icon={<LocalShippingIcon />} label={`Vendor: ${item.vendor?.name}`} sx={{ mr: 1, mb: 1 }} />
                <Chip
                  icon={item.status ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
                  label={item.status ? 'Active' : 'Inactive'}
                  color={item.status ? 'success' : 'default'}
                  sx={{ mb: 2 }}
                />

                <Stack direction="row" spacing={1}>
                 
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<InfoIcon />}
                    onClick={() => navigate(`/products/${item.type}/${item._id}`, { state: item.type})}
                  >
                    Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
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

export default Products;
