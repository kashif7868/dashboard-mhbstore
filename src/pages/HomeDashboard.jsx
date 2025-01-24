import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  FaChartLine,
  FaUserAlt,
} from "react-icons/fa"; // Ensure the imports are correct
import pkrIcon from "../assets/icons/pkr-icon.png";
import { MdKeyboardArrowRight } from "react-icons/md";
import RecentOrdersTable from "../components/RecentOrdersTable";
import { fetchReport } from "../app/reducers/reportSlice";
import { fetchUsers } from "../app/reducers/userListSlice";
import "../assets/css/homeDashboard.css";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardCard = ({
  title,
  value,
  percentage,
  icon,
  chartData,
  chartOptions,
}) => {
  useEffect(() => {
    return () => {
      if (ChartJS.instances.length > 0) {
        ChartJS.instances.forEach((chart) => chart.destroy());
      }
    };
  }, []);

  const isPositive = percentage.includes("+");

  return (
    <Card
      elevation={2}
      sx={{
        padding: 0.5,
        borderRadius: 2,
        flex: "1 1 calc(10% - 1px)",
        margin: "8px",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <IconButton sx={{ color: "primary.main", fontSize: "2rem" }}>
            {icon}
          </IconButton>
          <Box ml={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="h6" color="textPrimary">
              {value}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: isPositive ? "success.main" : "error.main" }}
            >
              {percentage}
            </Typography>
          </Box>
        </Box>

        {chartData && chartOptions && (
          <Box>
            <Line data={chartData} options={chartOptions} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const HomeDashboard = () => {
  const dispatch = useDispatch();

  // Selectors from Redux Store
  const { report, status: reportStatus } = useSelector((state) => state.report);
  const { users, loading: usersLoading, error: usersError } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(fetchReport());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Dynamically calculate goal progress based on the total sales vs. target goal
  const totalSales = report?.totalSales || 0;  // Get total sales from report
  const targetGoal = report?.targetGoal || 10000000;  // Set your target goal dynamically from the report

  // Calculate the progress to goal as a percentage
  const goalProgress = (totalSales / targetGoal) * 100 || 0;  // This calculates the goal progress percentage

  // Handling loading and error states
  if (reportStatus === "loading" || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (reportStatus === "failed" || usersError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">Error fetching data! Please try again.</Alert>
      </Box>
    );
  }

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
  ];

  return (
    <Box className="home-dashboard-wrapper-main" padding={3}>
      <Box className="home-container">
        <Box className="header-container" display="flex" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" color="textPrimary">
            Dashboard
          </Typography>
          <MdKeyboardArrowRight size={24} />
          <Typography variant="h6" color="textSecondary">
            Home
          </Typography>
        </Box>

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

        {/* Recent Orders Table */}
        <Grid item xs={12}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <RecentOrdersTable />
            </CardContent>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomeDashboard;
