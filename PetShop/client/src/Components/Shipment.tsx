import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  SelectChangeEvent,        // ✅ added
} from '@mui/material';
import axios from 'axios';
import APIs, { authApi, endpoints } from '../Config/APIs';
import { useLocation, useNavigate } from 'react-router';
import { useNotification } from '../Context/Notification';
import { useTranslation } from 'react-i18next';
import { Voucher } from '../Interface/Voucher';

interface Province { province_id: string; province_name: string; }
interface District { district_id: string; district_name: string; }
interface Ward { ward_id: string; ward_name: string; }

interface OrderLocation {
  city_id: string;
  city: string;
  district_id: string;
  district: string;
  ward_id: string;
  ward: string;
}

const Shipment: React.FC = () => {
  const { state } = useLocation();
  const orderId: string = state?.orderId || '';
  const totalPrice: number = state?.totalPrice || 0;

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [fullAdress, setFullAdress] = useState<string>("")
  const [fee, setFee] = useState(0);
  const [method, setMethod] = useState('');
  const [distance, setDistance] = useState(0);
  const [cities, setCities] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderLocation>({
    city_id: "",
    city: '',
    district_id: "",
    district: '',
    ward_id: "",
    ward: '',
  });

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tempShipmentFee, setTempShipmentFee] = useState(0);

  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const navigate = useNavigate();

  /** ---------- Helpers ---------- */
  const fetchData = async <T,>(url: string, setter: (data: T) => void) => {
    try {
      const { data } = await axios.get(url);
      setter(data.results);
    } catch (err) {
      console.error(`Error fetching ${url}:`, err);
      setter([] as unknown as T);
    }
  };

  const calculateShipmentFee = async (
    shippingMethod: string,
    km: number,
    voucherDiscount: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const { data } = await authApi.post(endpoints.calculateShipmentFee, {
        method: shippingMethod,
        distance: km,
        discount: voucherDiscount,
      });
      setValue(Math.ceil(data.shippingFee));
    } catch (err) {
      console.error('Error calculating shipment fee:', err);
    }
  };

  /** ---------- Handlers ---------- */
  const handleLocationChange = (
    e: SelectChangeEvent<string>,        // ✅ fixed type
    type: 'city' | 'district' | 'ward'
  ) => {
    const id = String(e.target.value);
    console.log("Order", order)
    if (type === 'city') {
      const city = cities.find(c => c.province_id === id);
      console.log("city", city)
      setOrder(prev => ({
        ...prev,
        city_id: id,
        city: city?.province_name || '',
        district_id: "",
        district: '',
        ward_id: "",
        ward: '',
      }));
      
      fetchData<District[]>(`https://vapi.vnappmob.com/api/v2/province/district/${id}`, setDistricts);
      setWards([]);
    }

    if (type === 'district') {
      const district = districts.find(d => d.district_id === id);
      setOrder(prev => ({
        ...prev,
        district_id: id,
        district: district?.district_name || '',
        ward_id: "",
        ward: '',
      }));
      fetchData<Ward[]>(`https://vapi.vnappmob.com/api/v2/province/ward/${id}`, setWards);
    }

    if (type === 'ward') {
      const ward = wards.find(w => w.ward_id === id);
      setOrder(prev => ({
        ...prev,
        ward_id: id,
        ward: ward?.ward_name || '',
      }));
    }
  };

  const calculateDistance = async () => {
    if (!buyerAddress.trim() || !order.ward || !order.district || !order.city) {
    showNotification(
      t('Please enter full address and select ward/commune, district/county, province/city.'),'warning');
    }
    
    const templeFullAdress = `${buyerAddress.trim()}, ${order.ward}, ${order.district}, ${order.city}, Vietnam`
    if (templeFullAdress !== fullAdress) {
      setFullAdress(`${buyerAddress.trim()}, ${order.ward}, ${order.district}, ${order.city}, Vietnam`);
    }
    else {
      return
    }

    const destinationAddress = process.env.REACT_APP_DestinationAddress || '';
    const mapboxToken = process.env.REACT_APP_MapToken;

    if (!destinationAddress || !mapboxToken) {
      showNotification(t('Missing store address or Mapbox token.'), 'error');
      return;
    }

    try {
      const origin = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAdress)}.json?access_token=${mapboxToken}`
      );
      const originCoords = origin.data.features[0]?.center;
      if (!originCoords) {
        showNotification(t('Delivery point elevation not found'), "warning");
        resetUserAddressInfo()
      }

      const dest = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationAddress)}.json?access_token=${mapboxToken}`
      );
      const destCoords = dest.data.features[0]?.center;
      if (!destCoords) {
        showNotification(t('Store location not found'), "error");
      }
      const directions = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.join(',')};${destCoords.join(',')}?access_token=${mapboxToken}&geometries=geojson`
      );
      const km = (directions.data.routes[0]?.distance || 0) / 1000;
      if (km <= 0 && method === 'Delivery') {
        showNotification(t('Invalid shipping address or method. Please check again.'), 'warning');
        resetUserAddressInfo()
        setMethod("")
        return;
      }

      setDistance(km);
      showNotification(t('Valid address. Distance calculated successfully!'), 'success');
      calculateShipmentFee(method, km, 0, setTempShipmentFee);
      calculateShipmentFee(method, km, discount, setFee);
    } catch (err) {
      console.error('Error calculating distance:', err);
      showNotification(t('An error occurred while calculating the distance. System will clean all informations about wrong address and then you can try again later!'), 'error');
      resetUserAddressInfo()
    } 
  };

  const handleMakeShipment = async () => {
    if (!buyerName || !buyerAddress || !buyerPhone || !method || !distance) {
      showNotification(t('Please fill in all information before creating a delivery order.'), 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.post(endpoints.createShipment, {
        buyerName,
        buyerAddress,
        buyerPhone,
        method,
        fee,
        order: orderId,
      });

      if (res.status === 201) {
        showNotification(res.data.message, 'success');
        if (selectedVoucherId)
          await authApi.patch(endpoints.updateVoucherUsageForUser(selectedVoucherId));

        navigate('/cart/shipment/checkout', {
          state: { orderId, totalPrice: totalPrice + fee },
        });
      }
    } catch (err) {
      console.error('Error creating shipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetUserAddressInfo = () => {
  // 👉 Reset address fields
  setBuyerAddress('');
  setOrder({
    city_id: "",
    city: '',
    district_id: "",
    district: '',
    ward_id: "",
    ward: '',
  });
  setDistricts([]);
  setWards([]);

  // 👉 Also reset shipment-related values so the UI is clean
  setDistance(0);
  setFee(0);
  setTempShipmentFee(0);
  setDiscount(0);
  setSelectedVoucherId('');
  setVouchers([]);
};


  /** ---------- Effects ---------- */
  useEffect(() => {
    fetchData<Province[]>('https://api.vnappmob.com/api/v2/province/', setCities);
  },[]);

  useEffect(() => {
    if (fee > 0) {
      APIs.get(`${endpoints.getAvailableVouchersForShipment}?shipmentFee=${fee}`)
        .then(res => setVouchers(res.data))
        .catch(err => console.error('Error fetching vouchers:', err));
    }
  }, [fee]);

  useEffect(() => {
    if (selectedVoucherId) {
      APIs.get(endpoints.getVoucher(selectedVoucherId))
        .then(res => setDiscount(res.data?.discount ?? 0))
        .catch(console.error);
    } else setDiscount(0);
  }, [selectedVoucherId, discount]);

  useEffect(() => {
    calculateShipmentFee(method, distance, discount, setFee);
  }, [discount, method, distance]);

  /** ---------- Render ---------- */
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          {t('Shipping Information')}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label={t('Recipient Name')}
              value={buyerName}
              onChange={e => setBuyerName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label={t('Phone Number')}
              value={buyerPhone}
              onChange={e => setBuyerPhone(e.target.value)} />
          </Grid>

          {/* Location Selects */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>{t('City/Province')}</InputLabel>
              <Select<string>                       
                value={order.city_id || ""}
                onChange={e => handleLocationChange(e, 'city')}
              >
                <MenuItem value={0}>{t('Select City/Province')}</MenuItem>
                {cities.map(c => (
                  <MenuItem key={c.province_id} value={c.province_id}>{c.province_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={!order.city_id}>
              <InputLabel>{t('District')}</InputLabel>
              <Select<string>
                value={order.district_id || ""}
                onChange={e => handleLocationChange(e, 'district')}
              >
                <MenuItem value={0}>{t('Select District')}</MenuItem>
                {districts.map(d => (
                  <MenuItem key={d.district_id} value={d.district_id}>{d.district_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={!order.district_id}>
              <InputLabel>{t('Ward/Commune')}</InputLabel>
              <Select<string>
                value={order.ward_id || ""}
                onChange={e => handleLocationChange(e, 'ward')}
              >
                <MenuItem value={0}>{t('Select Ward/Commune')}</MenuItem>
                {wards.map(w => (
                  <MenuItem key={w.ward_id} value={w.ward_id}>{w.ward_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('Recipient Address (Only house number and street name)')}
              value={buyerAddress}
              onChange={e => setBuyerAddress(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('Shipping Method')}</InputLabel>
              <Select value={method} onChange={e => setMethod(e.target.value)}>
                <MenuItem value="At the store">{t('At the store')}</MenuItem>
                <MenuItem value="Delivery">{t('Delivery')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>{t('Search Vouchers')}</InputLabel>
              <Select value={selectedVoucherId}
                onChange={e => setSelectedVoucherId(e.target.value as string)}>
                <MenuItem value="">{t('None')}</MenuItem>
                {vouchers.map(v => (
                  <MenuItem key={v._id} value={v._id}>
                    {v.code} - {v.discount}% - {v.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Button variant="outlined" onClick={calculateDistance} sx={{ height: '100%' }}>
              {t('Calculate Distance')}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>{t('Distance')}: {distance ? `${distance.toFixed(2)} km` : t('Not determined')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>{t('Temporary Shipping Fee')}: {tempShipmentFee > 0 ? `${tempShipmentFee.toLocaleString()} VND` : t('Not available')}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              {t('Discount Shipping Fee')}: 
              {tempShipmentFee > 0 && fee > 0
                ? `${(tempShipmentFee - fee).toLocaleString()} VND`
                : t('Not available')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>{t('Shipping Fee')}: {fee > 0 ? `${fee.toLocaleString()} VND` : t('Not available')}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleMakeShipment}
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : t('Confirm Shipping Information')}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Shipment;
