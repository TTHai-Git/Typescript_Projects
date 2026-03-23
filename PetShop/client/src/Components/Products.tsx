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
  IconButton,
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
import ClearIcon from '@mui/icons-material/Clear';
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
  const [categoryId, setCategoryId] = useState<string>("")
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [sortBy, setSortBy] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { addToRecentlyViewedProducts} = useRecentlyViewedProducts()
  const {t} = useTranslation()
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams(searchParams);

      const res = await APIs.get(`${endpoints['getAllProducts']}?${query.toString()}`);
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
    const newCategoryId = searchParams.get("category") || ""

    setSearchTerm(newSearchTerm);
    setSortBy(newSortBy);
    setCategoryId(newCategoryId)
  }, [searchParams]);


  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);


  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      const params: any = { page: newPage.toString() };
      if (sortBy) params.sort = sortBy.toString()
      if (categoryId) params.category = categoryId.toString();
      if (searchTerm) params.search = searchTerm.toString()
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
    { label: t("None"), id: 'none'}
  ];
  
  const handleAddToRecentLyViewedProducts = (product: Product) => {
    addToRecentlyViewedProducts(product)
    navigate(`/products/${product._id}/${product.__t}`)
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
          onChange={(e) => {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');
            params.set('search', e.target.value.trim());
            setSearchParams(params);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const params = new URLSearchParams(searchParams);
              params.set('page', '1');
              params.set('search', searchTerm.trim());
              setSearchParams(params);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", "1");
                  if (searchTerm.trim()) params.set("search", searchTerm.trim());
                  else params.delete("search");
                  setSearchParams(params);
                }}>
                  
                <SearchIcon color="primary" />
                </IconButton>
                
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label={t("Clear search")}
                  onClick={() => {
                    setSearchTerm("");                         // ✅ clear the input
                    const params = new URLSearchParams(searchParams);
                    params.delete("search");                   // ✅ remove query param
                    params.set("page", "1");                   // optional: reset page
                    setSearchParams(params);
                  }}
                >
                <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
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
              onClick={() => {
                setCategoryId("")
                const params = new URLSearchParams(searchParams)
                params.delete("category")
                params.set("page", "1")
                setSearchParams(params);
              }}
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
                label={t(cat.name)}
                icon={<CategoryIcon />}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', '1');             // ✅ reset to first page
                  params.set('category', cat._id);     // ✅ use the clicked category
                  setSearchParams(params);             // ✅ merge, don't overwrite
                }}
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
                const selectedSort = newValue?.id.toString() || "";

                const params = new URLSearchParams(searchParams);
                params.set("page", "1");
                if (selectedSort) params.set("sort", selectedSort);
                else params.delete("sort");

                setSearchParams(params);
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
                width: { xs: '100%', sm: 300 },
                mt: { xs: 2, sm: 0 },
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />
        </Box>
      </Box>
  
      {loading ? (
        <p className="loading">🔄 {t("Loading Products...")}</p>
      ) : (
        <>
        
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
          {products.length === 0 ? (
            <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "200px",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  {t("Product not found")}
                </Typography>
            </Box>
          ): (
            <Grid container spacing={3}>
            {products.map((item) => (
              <Grid item xs={12} sm={6} md={6} key={item._id}>

                <Card
                  sx={{
                    borderRadius: "24px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
                    backgroundColor: '#fff',
                    border: "2px solid transparent",
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: "0 20px 40px rgba(255, 152, 0, 0.15)",
                      borderColor: "rgba(255, 152, 0, 0.2)",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddToRecentLyViewedProducts(item)}
                >
                  {/* Status Badge */}
                  <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
                    <Chip
                      icon={item.status ? <CheckCircleOutlineIcon fontSize="small"/> : <CancelOutlinedIcon fontSize="small"/>}
                      label={item.status ? t("Active") : t('Inactive')}
                      size="small"
                      sx={{ 
                        fontWeight: 700, 
                        bgcolor: item.status ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)', 
                        color: '#fff',
                        backdropFilter: "blur(4px)"
                      }}
                    />
                  </Box>
                  
                  {/* Avatar/Image area */}
                  <Box sx={{ position: 'relative', pt: "75%", width: '100%', overflow: 'hidden', bgcolor: '#fdfbf7' }}>
                    <Avatar
                      variant="square"
                      src={item.imageUrl}
                      alt={item.name}
                      sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', p: 3, transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.1)' } }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, md: 3 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" fontWeight="800" sx={{ color: '#3e2723', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                       <Typography variant="h5" fontWeight="900" sx={{ color: '#ff9800' }}>
                         {item.price.toLocaleString()} VND
                       </Typography>
                    </Box>

                    <Stack spacing={1} mb={3}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Inventory sx={{ color: '#ab47bc', fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                          <Box component="span" fontWeight="600">{t("Stock")}:</Box> {item.stock} {t("items")}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CategoryIcon sx={{ color: '#29b6f6', fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                          <Box component="span" fontWeight="600">{t("Category")}:</Box> {t(item.category?.name || "")}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Ratings */}
                    <Box mt="auto" display="flex" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography variant="body2" fontWeight="700" sx={{ color: '#3e2723', mr: 0.5 }}>{item.beforeTotalRatingRounded}</Typography>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const rating = item.totalRating ?? 0;
                          return (i + 1 <= Math.floor(rating)) ? <StarIcon key={i} sx={{ color: '#ffc107', fontSize: 18 }} />
                               : (i < rating) ? <StarHalfIcon key={i} sx={{ color: '#ffc107', fontSize: 18 }} />
                               : <StarBorderIcon key={i} sx={{ color: '#e0e0e0', fontSize: 18 }} />;
                        })}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>({item.totalOrder} {t("Orders")})</Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          )}
          
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
        </>
      )}
    </Box>
  );
};

export default Products;
