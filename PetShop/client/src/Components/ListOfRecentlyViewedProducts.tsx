import React, { useEffect, useRef } from 'react'
import { useRecentlyViewedProducts } from '../Context/RecentlyViewedProducts'
import {
  LabelOutlined as LabelOutlinedIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  AttachMoney as AttachMoneyIcon,
  Category as CategoryIcon,
  Factory as FactoryIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  Inventory,
  Delete as DeleteIcon,
  DeleteSweep as DeleteSweepIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';


const ListOfRecentlyViewedProducts = () => {
  const {
    recentlyViewedProducts,
    removeFromRecentlyViewedProducts,
    clearRecentlyViewedProducts,
  } = useRecentlyViewedProducts();

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {t} = useTranslation()
  

  // ✅ Auto scroll effect
  useEffect(() => {
    if (recentlyViewedProducts.length === 0) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        container.scrollBy({ left: 250, behavior: 'smooth' });

        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [recentlyViewedProducts.length]);

  const handleRemoveFromRecentlyViewedProducts = (_id: string) => {
    if (!window.confirm('Are you sure you want to remove this item from your viewed products list?')) return;
    removeFromRecentlyViewedProducts(_id);
   
    
  };

  const handleClearRecentlyViewedProducts = () => {
    if (!window.confirm('Are you sure to remove all of these items from the viewed products list?')) return;
    clearRecentlyViewedProducts();
  };

  const handleGoToDetailsProduct = (productType: string, productId: string) => {
    navigate(`/products/${productId}/${productType}`);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, py: { xs: 4, md: 6 }, position: 'relative', bgcolor: '#fff', borderRadius: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.02)', my: 4, border: '1px solid #f0f0f0' }}>
        <Typography variant="h4" fontWeight="900" sx={{ color: '#3e2723', mb: 4, textAlign: 'center' }}>
            {t("List Of Recently Viewed Products")}
        </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2} sx={{
        position: 'absolute',
        top: 20,
        right: 20,
      }}>
        {recentlyViewedProducts.length > 0 && (
          <Tooltip title={t("Clear All")} arrow>
            <IconButton color="error" onClick={handleClearRecentlyViewedProducts}>
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

    {recentlyViewedProducts.length === 0 ? (
      <Alert severity="info" variant="outlined">
        {t("You haven’t viewed any products yet. Start browsing to see them here!")}
      </Alert>
    ) : (
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 1,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: 4 },
        }}
      >
        {recentlyViewedProducts.map((item) => (
          <Card
            key={item._id}
            elevation={0}
            sx={{
                minWidth: 300,
                flexShrink: 0,
                border: '1px solid #f0f0f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: '24px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
                backgroundColor: '#fff',
                transition: 'transform 0.3s ease',
                scrollSnapAlign: 'start',
                '&:hover': {
                    transform: 'scale(1.02) translateY(-4px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                },
                cursor: "pointer"
            }}
            onClick={() =>
              navigate(`/products/${item._id}/${item.__t}`)
            }
          >
            <Tooltip title={t("Remove")} arrow>
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  handleRemoveFromRecentlyViewedProducts(item._id);
                }}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={item.imageUrl || (item as any).images?.[0]}
                  alt={item.name}
                  sx={{ width: 70, height: 70, mr: 2, borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                  variant="rounded"
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#3e2723', lineHeight: 1.2, mb: 0.5, maxWidth: 200, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">
                    {item.category?.name || 'Category non-defined'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ bgcolor: '#fffbf7', p: 1.5, borderRadius: '16px', border: '1px solid #ffe8cc', mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ff9800', fontWeight: '900', textAlign: 'center' }}>
                  {item.price.toLocaleString()} VND
                </Typography>
              </Box>
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
            </CardContent>
            <CardContent sx={{ pt: 0 }}> {/* Added pt:0 to reduce space between content and chips */}
              <Stack spacing={1} mb={2}> {/* Increased mb for more space before button */}
                <Chip icon={<CategoryIcon />} label={`${t("Category")}: ${item.category?.name}`} />
                <Chip icon={<FactoryIcon />} label={`${t("Brand")}: ${item.brand?.name}`} />
                <Chip icon={<LocalShippingIcon />} label={`${t("Vendor")}: ${item.vendor?.name}`} />
                <Chip
                  icon={item.status ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
                  label={item.status ? t("Active") : t("Inactive")}
                  color={item.status ? 'success' : 'default'}
                />
              </Stack>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handleGoToDetailsProduct(item.__t, item._id);
                  }}
                  sx={{ textTransform: 'none', borderRadius: '30px', fontWeight: 'bold', bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' }, boxShadow: '0 8px 20px rgba(255, 152, 0, 0.3)' }}
                >
                  {t("View Details")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    )}
  </Box>
);

};

export default ListOfRecentlyViewedProducts;
