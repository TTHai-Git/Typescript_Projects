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

  return (
  <Box sx={{ p: 2 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h5" fontWeight="bold">
        {t("Recently Viewed Products")}
      </Typography>
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
            sx={{
              minWidth: 300,
              flexShrink: 0,
              borderRadius: 3,
              boxShadow: 5,
              backgroundColor: '#fafafa',
              transition: '0.3s',
              position: 'relative',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 10,
              },
              cursor: "pointer"
            }}
            onClick={() =>
              navigate(`/products/${item._id}/${item.type}`)
            }
          >
            <Tooltip title={t("Remove")} arrow>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveFromRecentlyViewedProducts(item._id)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>

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
              <Stack spacing={1} mb={1}>
                <Chip icon={<CategoryIcon />} label={`${t("Category")}: ${item.category?.name}`} />
                <Chip icon={<FactoryIcon />} label={`${t("Brand")}: ${item.brand?.name}`} />
                <Chip icon={<LocalShippingIcon />} label={`${t("Vendor")}: ${item.vendor?.name}`} />
                <Chip
                  icon={item.status ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
                  label={item.status ? t("Active") : t("Inactive")}
                  color={item.status ? 'success' : 'default'}
                />
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="center">
                <Tooltip title={t("View Details")} arrow>
                  <Button
                    variant="outlined"
                    color="info"
                    startIcon={<InfoIcon />}
                    onClick={() =>
                      navigate(`/products/${item._id}/${item.type}`)
                    }
                  >
                    {t("Details")}
                  </Button>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    )}
  </Box>
);

};

export default ListOfRecentlyViewedProducts;
