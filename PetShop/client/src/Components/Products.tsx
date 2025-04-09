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
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
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

import { useNavigate, useSearchParams } from 'react-router-dom';
import Product from '../Interface/Product';
import { Category } from '../Interface/Category';
import '../Assets/CSS/Pagination.css';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (categoryId) query.append('category', categoryId);
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

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

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

      {/* Filter Chips */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label="All"
          icon={<CategoryIcon />}
          onClick={() => setSearchParams({ page: '1' })}
          sx={{
            cursor: 'pointer',
            backgroundColor: !categoryId ? 'primary.main' : 'grey.300',
            color: !categoryId ? 'white' : 'black',
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
            }}
          />
        ))}
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
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(item._id)}
                  >
                    Add to Cart
                  </Button>
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
