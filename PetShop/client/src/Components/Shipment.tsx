import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import axios from 'axios'
import APIs, { authApi, endpoints } from '../Config/APIs'
import { useLocation, useNavigate, useParams } from 'react-router'
import { useNotification } from '../Context/Notification'
import { useTranslation } from 'react-i18next'
import { Voucher } from '../Interface/Voucher'



const Shipment = () => {
  const location = useLocation()
  const orderId:string = location.state.orderId || ""
  const  totalPrice:number = location.state.totalPrice || 0
  const [buyerName, setBuyerName] = useState<string>('')
  const [buyerPhone, setBuyerPhone] = useState<string>('')
  const [buyerAddress, setBuyerAddress] = useState<string>('')
  const [fee, setFee] = useState<number>(0)
  const [method, setMethod] = useState<string>('')
  const [distance, setDistance] = useState<number>(0)
  const [cities, setCities] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [order, setOrder] = useState({
    city_id: 0,
    city: "",
    district_id: 0,
    district: "",
    ward_id: 0,
    ward: "",
    
  });

  const [vouchers, setVouchers] = useState<Voucher[]>()
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>("")
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>()
  const [discount, setDiscount] = useState<number>(0)
  const [templeShipmentFee, setTempShipmentFee] = useState<number>(0)
  

  const { showNotification } = useNotification()
  const {t} = useTranslation()
  
  const handleMakeShipment = async () => {
    try {
        setLoading(true)
        if (!buyerName || !buyerAddress || !buyerPhone || !method || !distance) {
          showNotification("Vui lòng điền đầy đủ thông tin trước khi tạo đơn giao hàng.", "warning")
          return
        }
        const res = await authApi.post(endpoints.createShipment, {
          buyerName,
          buyerAddress,
          buyerPhone,
          method,
          fee,
          order: orderId,
        })
        if(res.status === 201) {
          showNotification(res.data.message, "success")
          handleUpdateVoucherUsageForUser(selectedVoucherId)
          navigate("/cart/shipment/checkout", {
            state: {
              orderId: orderId,
              totalPrice: totalPrice + fee,
            }
          })
        }
      } catch (error) {
        console.error("Error creating shipment:", error)
      } finally {
        setLoading(false)
      }
  }  
  
  const handleUpdateVoucherUsageForUser = async (voucherId: string) => {
    try {
      const res = await authApi.patch(endpoints['updateVoucherUsageForUser'](voucherId))
    } catch (error) {
      console.log(error)
    }
  }

  const navigate = useNavigate()

  const handleCityChange = (e:any) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find(
      (city) => city.province_id === selectedCityId
    );

    setOrder({
      ...order,
      city_id: selectedCity.province_id,
      city: selectedCity.province_name, // Save city name for display
      district: "",
      ward: "",
    });

    // Fetch districts for the selected city
    axios
      .get(`https://vapi.vnappmob.com/api/v2/province/district/${selectedCityId}`)
      .then((response) => setDistricts(response.data.results))
      .catch((error) => {
        console.error("Error fetching districts:", error);
        setDistricts([]); // Clear districts if there's an error
      });
  };

  const handleDistrictChange = (e:any) => {
    const selectedDistrictId = e.target.value;
    const selectedDistrict = districts.find(
      (district) => district.district_id === selectedDistrictId
    );

    setOrder({
      ...order,
      district_id: selectedDistrict.district_id,
      district: selectedDistrict.district_name,
      ward: "",
    });

    // Fetch wards for the selected district
    axios
      .get(`https://vapi.vnappmob.com/api/v2/province/ward/${selectedDistrictId}`)
      .then((response) => setWards(response.data.results))
      .catch((error) => {
        console.error("Error fetching wards:", error);
        setWards([]); // Clear wards if there's an error
      });
  };

  const handleWardChange = (e:any) => {
    const selectedWardId = e.target.value;
    const selectedWard = wards.find((ward) => ward.ward_id === selectedWardId);

    setOrder({
      ...order,
      ward_id: selectedWard.ward_id,
      ward: selectedWard.ward_name,
    });
  };

const calculateDistance = async (buyerAddress: string) => {
  try {
    // Ensure all components are present
    if (!buyerAddress.trim() || !order.ward || !order.district || !order.city) {
      showNotification(
        "Vui lòng nhập đầy đủ địa chỉ và chọn phường/xã, quận/huyện, tỉnh/thành.",
        "warning"
      );
      return;
    }

    const fullAddress = `${buyerAddress.trim()}, ${order.ward}, ${order.district}, ${order.city}, Việt Nam`;
    console.log("Full Address:", fullAddress);
    setBuyerAddress(fullAddress);

    const destinationAddress = process.env.REACT_APP_DestinationAddress || "";
    if (!destinationAddress) {
      console.error("Environment variable 'REACT_APP_DestinationAddress' is not set.");
      showNotification("Không tìm thấy địa chỉ cửa hàng.", "warning");
      return;
    }

    const mapboxToken = process.env.REACT_APP_MapToken;
    // console.log("mapboxToken", mapboxToken)
    if (!mapboxToken) {
      console.error("Mapbox token is missing.");
      showNotification("Token Mapbox không hợp lệ.", "error");
      return;
    }

    // ✅ Force true CORS requests so the browser sends the Origin header.
    const axiosOptions = {
      params: { access_token: mapboxToken },
      // withCredentials: true    // <─ important
    };

    const [originResponse, destinationResponse] = await Promise.all([
      axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json`,
        axiosOptions
      ),
      axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destinationAddress)}.json`,
        axiosOptions
      ),
    ]);

    const originCoordinates = originResponse.data.features[0]?.center;
    const destinationCoordinates = destinationResponse.data.features[0]?.center;

    if (!originCoordinates || !destinationCoordinates) {
      showNotification("Lỗi: Không tìm thấy tọa độ cho địa chỉ.", "error");
      return;
    }

    const directionsResponse = await axios.get(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoordinates.join(",")};${destinationCoordinates.join(",")}`,
      {
        params: { access_token: mapboxToken, geometries: "geojson" },
        withCredentials: false   // <─ again, ensure CORS mode
      }
    );

    const distanceInKilometers = (directionsResponse.data.routes[0]?.distance || 0) / 1000;

    if (distanceInKilometers <= 0 && method === "Delivery") {
      showNotification("Địa chỉ không hợp lệ. Vui lòng kiểm tra lại.", "warning");
      return;
    }

    setDistance(distanceInKilometers);
    showNotification("Địa chỉ hợp lệ. Đã tính toán khoảng cách thành công!", "success");

    handleCalculateTempleShipmentFee(method, distanceInKilometers, 0);
    handleCalculateShipmentFee(method, distanceInKilometers, discount);
  } catch (error) {
    console.error("Error calculating distance:", error);
    showNotification("Có lỗi xảy ra khi tính khoảng cách.", "error");
  }
};


  const handleCalculateShipmentFee = async (method: string, distance: number, discount: number) => {
    try {
      const res = await authApi.post(endpoints.calculateShipmentFee, {
      method,
      distance: distance, // use raw float if backend expects number
      discount: discount,
    });
    setFee(Math.ceil(res.data.shippingFee));
    } catch (error)  {
      console.log("Something Went Wrong", error)
    }
  }

  const handleCalculateTempleShipmentFee = async (method: string, distance: number, discount: number) => {
    try {
      const res = await authApi.post(endpoints.calculateShipmentFee, {
      method,
      distance: distance, // use raw float if backend expects number
      discount: discount,
    });
    setTempShipmentFee(Math.ceil(res.data.shippingFee));
    } catch (error)  {
      console.log("Something Went Wrong", error)
    }
  }
  const handleGetAvailableVouchersForOrders = async (shipmentFee: Number) => {
    try {
      
      const res = await APIs.get(`${endpoints["getAvailableVouchersForShipment"]}?shipmentFee=${shipmentFee}`)
      if (res.status === 200){
        setVouchers(res.data)
      }
    } catch (error) {
      console.log("Something Went Wrong", error)
    } finally {
      
    }
  }

  const handleGetDiscountOfVoucher= async(voucherId: string) => {
    try {
      const res = await APIs.get(endpoints["getVoucher"](voucherId))
      setSelectedVoucher(res.data)
      setDiscount(res.data?.discount ?? 0)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Fetch cities on mount
    axios
      .get("https://api.vnappmob.com/api/v2/province/")
      .then((response) => setCities(response.data.results))
      .catch((error) => console.error("Error fetching cities:", error));
    console.log("Order ID:", orderId)
    console.log("Total Price:", totalPrice)
  }, []);

  useEffect(() => {
    handleGetAvailableVouchersForOrders(fee)
  }, [fee])

  useEffect(() => {
    if (selectedVoucherId) {
      handleGetDiscountOfVoucher(selectedVoucherId)
      // console.log("Shiment Fee", fee)
      // console.log("Discount", discount)
    }
    else {
      setDiscount(0)
    }
    handleCalculateShipmentFee(method, distance, discount)
  }, [selectedVoucherId, discount])

  return (
  <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {t("Shipping Information")}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("Recipient Name")}
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t("Phone Number")}
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>{t("City/Province")}</InputLabel>
            <Select
              name="city"
              value={order.city_id || ''}
              onChange={handleCityChange}
              label={t("City/Province")}
            >
              <MenuItem value="">{t("Select City/Province")}</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city.province_id} value={city.province_id}>
                  {city.province_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth disabled={!order.city_id}>
            <InputLabel>{t("District")}</InputLabel>
            <Select
              name="district"
              value={order.district_id || ''}
              onChange={handleDistrictChange}
              label={t("District")}
            >
              <MenuItem value="">{t("Select District")}</MenuItem>
              {districts.map((district) => (
                <MenuItem key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth disabled={!order.district_id}>
            <InputLabel>{t("Ward/Commune")}</InputLabel>
            <Select
              name="ward"
              value={order.ward_id || ''}
              onChange={handleWardChange}
              label={t("Ward/Commune")}
            >
              <MenuItem value="">{t("Select Ward/Commune")}</MenuItem>
              {wards.map((ward) => (
                <MenuItem key={ward.ward_id} value={ward.ward_id}>
                  {ward.ward_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("Recipient Address (Only house number and street name)")}
            value={buyerAddress}
            onChange={(e) => setBuyerAddress(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t("Shipping Method")}</InputLabel>
            <Select
              value={method}
              label={t("Shipping Method")}
              onChange={(e) => setMethod(e.target.value)}
            >
              <MenuItem value="At the store">{t("At the store")}</MenuItem>
              <MenuItem value="Delivery">{t("Delivery")}</MenuItem>
            </Select>
          </FormControl>
          
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t("Search Vouchers")}</InputLabel>
            <Select
              value={selectedVoucherId}
              onChange={(e) => setSelectedVoucherId(e.target.value as string)}
            >
              {vouchers?.map((v) => (
                <MenuItem key={v._id} value={v._id}>
                  {v.code} - {v.discount.toString()}% - {v.description}
                </MenuItem>
              ))}
              <MenuItem value="">{t("None")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Button
            variant="outlined"
            onClick={() => calculateDistance(buyerAddress)}
            sx={{ height: '100%' }}
          >
            {t("Calculate Distance")}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography>
            {t("Distance")}: {distance ? `${distance.toFixed(2).toString()} km` : t("Not determined")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            {t("Temporary Shipping Fee")}: {templeShipmentFee > 0 ? `${templeShipmentFee.toLocaleString()} VND` : t("Not available")}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            {t("Shipping Fee")}: {fee > 0 ? `${fee.toLocaleString()} VND` : t("Not available")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleMakeShipment()}
            disabled={loading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : t("Confirm Shipping Information")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
);

}
export default Shipment
