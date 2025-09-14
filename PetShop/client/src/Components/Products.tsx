import React, { useEffect, useState } from 'react';
// import axios from 'axios';
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
  Tooltip,
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
  Inventory,
} from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Product from '../Interface/Product';
import { Category } from '../Interface/Category';
import '../Assets/CSS/Pagination.css';
import APIs, { endpoints } from '../Config/APIs';
import { useRecentlyViewedProducts } from '../Context/RecentlyViewedProducts';
import { useTranslation } from 'react-i18next';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const location = useLocation()

  const { addToRecentlyViewedProducts} = useRecentlyViewedProducts()
  const {t} = useTranslation()


  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (categoryId) query.append('category', categoryId);
      if (searchTerm) query.append('search', searchTerm);
      if (sortBy) query.append('sort', sortBy);
      query.append('page', currentPage.toString());
  
      // const res = await axios.get(`/v1/products?${query.toString()}`);
      const res = await APIs.get(`${endpoints['getAllProducts']}?${query.toString()}`)
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
      // const res = await axios.get('/v1/categories');
      const res = await APIs.get(endpoints.getCategories)
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
    { label: t('Increasing By Price'), id: 'price_asc' },
    { label: t('Decrease By Price'), id: 'price_desc' },
    { label: t('Latest'), id: 'latest' },
    { label: t('Oldest'), id: 'oldest' },
    { label: 'A-Z', id: 'az' },
    { label: 'Z-A', id: 'za' },
  ];
  
  const handleAddToRecentLyViewedProducts = (product: Product) => {
    addToRecentlyViewedProducts(product)
    navigate(`/products/${product.type}/${product._id}`, 
    { state: {
      type: product.type,
      from: location.pathname + location.search, 
      } 
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4} fontWeight="bold" color="primary">
        {t("Product List")}: {total} {t("Products")}
      </Typography>
      
      
  
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 🔍 Search Bar */}
        <TextField
          label={t("Search")}
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
              label={t("All")}
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
                label={t(`${cat.name}`)}
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
                label={t("Sort By")}
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
  
      {/* Main Content with Advertisements */}
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
            <Typography variant="h6" color="secondary">{t("Advertisement")}</Typography>
            {/* You can replace this with an image/banner */}
          </Box>
        </Grid>
  
        {/* Product List */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {products.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item._id}>

                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 5,
                    backgroundColor: '#fafafa',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 10,
                    },
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar
                      variant="rounded"
                      src={item.imageUrl}
                      alt={item.name}
                      sx={{ width: 80, height: 80 }}
                    />
                    <Box>
                      <Typography variant="h6" noWrap>
                        <LabelOutlinedIcon fontSize="small" /> {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        <ChatBubbleOutlineIcon fontSize="small" /> {item.description}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        <AttachMoneyIcon fontSize="small" /> {item.price.toLocaleString()} VND
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        <Inventory sx={{ mr: 1 }} /> {t("Inventory")}: {item.stock} {t("items")}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold" color="primary">
                        <AddShoppingCartIcon fontSize="small" /> {item.totalOrder} {t("Orders")}
                      </Typography>
                      <Box>
                    <Chip
                      key={item._id}
                      label={
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <span>{item.beforeTotalRatingRounded}</span>
                          {Array.from({ length: 5 }).map((_, i) => {
                            const rating = item.totalRating ?? 0;
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
                  </Box>
                    </Box>
                    
                  </Box>
                  
  
                  <CardContent>
                    <Stack spacing={1} mb={2}>
                      <Chip icon={<CategoryIcon />} label={`${t("Category")}: ${t(`${item.category.name}`)}`} />
                      <Chip icon={<FactoryIcon />} label={`${t("Brand")}: ${item.brand?.name}`} />
                      <Chip icon={<LocalShippingIcon />} label={`${t("Vendor")}: ${item.vendor?.name}`} />
                      <Chip
                        icon={item.status ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
                        label={item.status ? t("Active") : t('Inactive')}
                        color={item.status ? 'success' : 'default'}
                      />
                    </Stack>
  
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title={t("View Details")} arrow>
                        <Button
                          variant="outlined"
                          color="info"
                          startIcon={<InfoIcon />}
                          onClick={() => handleAddToRecentLyViewedProducts(item)}
                        >
                          {t("Details")}
                        </Button>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
  
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
            <Typography variant="h6" color="secondary">{t("Advertisement")}</Typography>
          </Box>
        </Grid>
      </Grid>
  
      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button onClick={() => changePage(1)} disabled={currentPage === 1}>{t("First")}</Button>
        <Button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>{t("Previous")}</Button>
        <Typography variant="body1">Page {currentPage} of {pages}</Typography>
        <Button onClick={() => changePage(currentPage + 1)} disabled={currentPage === pages}>{t("Next")}</Button>
        <Button onClick={() => changePage(pages)} disabled={currentPage === pages}>{t("Last")}</Button>
      </Stack>
      
    </Box>
  );
  
  
};

export default Products;
