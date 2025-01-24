import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { FaChartLine, FaUserAlt, FaShoppingCart } from "react-icons/fa"; // Example icons
import { fetchReport } from "../app/reducers/reportSlice";
import { fetchUsers } from "../app/reducers/userListSlice";
import { fetchAllOrders } from "../app/reducers/orderSlice";
import { getAllProducts } from "../app/reducers/productSlice";
import pkrIcon from "../assets/icons/pkr-icon.png"; // Make sure this path is correct!
import "../assets/css/homeDashboard.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registering ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// DashboardCard Component
const DashboardCard = ({
  title,
  value,
  percentage,
  icon,
  chartData,
  chartOptions,
}) => {
  return (
    <Card elevation={2} sx={{ padding: 1, margin: 1, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Box>{icon}</Box>
          <Box ml={2}>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="h5">{value}</Typography>
            <Typography
              variant="caption"
              sx={{
                color: percentage.includes("+") ? "green" : "red",
              }}
            >
              {percentage}
            </Typography>
          </Box>
        </Box>
        {chartData && chartOptions && (
          <Line data={chartData} options={chartOptions} />
        )}
      </CardContent>
    </Card>
  );
};

// Reports Component
const Reports = () => {
  const dispatch = useDispatch();

  const { report, status: reportStatus } = useSelector((state) => state.report);
  const { orders, status: ordersStatus } = useSelector((state) => state.order);
  const {
    users,
    loading: usersLoading,
    error: usersError,
  } = useSelector((state) => state.users);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.product);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchReport());
    dispatch(fetchUsers());
    dispatch(fetchAllOrders());
    dispatch(getAllProducts());
  }, [dispatch]);

  // Calculate goal progress
  const totalSales = report?.totalSales || 0;
  const targetGoal = report?.targetGoal || 10000000;
  const goalProgress = (totalSales / targetGoal) * 100 || 0;

  // Handling loading and error states
  if (
    reportStatus === "loading" ||
    usersLoading ||
    productsLoading ||
    ordersStatus === "loading"
  ) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (
    reportStatus === "failed" ||
    usersError ||
    productsError ||
    ordersStatus === "failed"
  ) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Alert severity="error">Error fetching data! Please try again.</Alert>
      </Box>
    );
  }

  // Fixing NaN for total orders and making sure data is available
  const totalOrders = report?.totalOrders || 0;
  const totalCompletedOrders = report?.totalCompletedOrders || 0;
  const totalPendingOrders = report?.totalPendingOrders || 0;
  const totalCancelledOrders = report?.totalCancelledOrders || 0;
  const totalProducts = products?.length || 0;
  // Dynamic Data from Redux Store
  const dashboardCardData = [
    {
      title: "Total Sales",
      value: `₨${totalSales}`,
      percentage: `${goalProgress.toFixed(2)}%`,
      icon: <FaChartLine size={24} color="#3b82f6" />,
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Sales",
            data: report?.sales || [200, 400, 300, 500, 700, 600, 800],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    },
    {
      title: "Total Income",
      value: `₨${report?.totalIncome || "0"}`,
      percentage: "-1.56%",
      icon: <img src={pkrIcon} alt="PKR Icon" style={{ width: 24 }} />,
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Income",
            data: report?.income || [500, 300, 400, 300, 200, 400, 300],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    },
    {
      title: "Total Users",
      value: users?.length || 0,
      percentage: "+1.56%",
      icon: <FaUserAlt size={24} color="#10b981" />,
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Users",
            data: users?.weekly || [100, 200, 150, 300, 250, 350, 400],
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    },
    {
      title: "Total Orders",
      value: totalOrders || "0",
      percentage: `${(totalOrders / targetGoal) * 100}%`,
      icon: <FaShoppingCart size={24} color="#3b82f6" />,
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Orders",
            data: orders?.weekly || [50, 100, 150, 200, 250, 300, 350],
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    },
    {
      title: "Total Products",
      value: totalProducts,
      percentage: "0%",
      icon: <FaShoppingCart size={24} color="#ef4444" />,
      chartData: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Products",
            data: products?.weekly || [20, 30, 50, 70, 90, 100, 120],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    },
  ];

  return (
    <Box className="home-dashboard-wrapper-main" padding={3}>
      <Box display="flex" flexWrap="wrap" justifyContent="space-between" mb={3}>
        <Card
          elevation={3}
          sx={{
            padding: 2,
            borderRadius: 2,
            flex: "1 1 calc(14% - 16px)",
            margin: "8px",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Great! Your goal is almost complete
            </Typography>
            <Typography variant="body2">
              You have completed{" "}
              <span style={{ color: "#3f51b5", fontWeight: "bold" }}>
                {goalProgress.toFixed(2)}%
              </span>{" "}
              of your target. You can view the work details.
            </Typography>
            <Box
              mt={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                border: "4px solid #3f51b5",
              }}
            >
              <Typography variant="body2" color="primary">
                {goalProgress.toFixed(2)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
        {dashboardCardData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            percentage={card.percentage}
            icon={card.icon}
            chartData={card.chartData}
            chartOptions={card.chartOptions}
          />
        ))}
      </Box>

      {/* Table to Display Unused Variables */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Orders Breakdown
        </Typography>
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order Status</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Completed Orders</TableCell>
                <TableCell>{totalCompletedOrders}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pending Orders</TableCell>
                <TableCell>{totalPendingOrders}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Cancelled Orders</TableCell>
                <TableCell>{totalCancelledOrders}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Reports;
