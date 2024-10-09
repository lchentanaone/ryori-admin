import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";

Chart.register(ArcElement);

const DoughnutChart = () => {
  const [consumption, setConsumption] = useState(0);
  const [limit, setLimit] = useState(0);

  const fetchBranch = async () => {
    try {
      const token = localStorage.getItem("token");
      const branch_Id = localStorage.getItem("branch_Id");
      console.log({ branch_Id });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/branch/${branch_Id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const branch = await response.json();
      setConsumption(branch.used);
      setLimit(branch.limit);
    } catch (error) {
      console.error("Error fetching branch data:", error);
    }
  };
  const remaining = limit - consumption;
  const data = {
    // labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        data: [remaining, consumption],
        backgroundColor: ["#DB1B1B", "#12BF38"],
        // hoverBackgroundColor: ["#DB1B1B", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: "My Doughnut Chart",
    },
    legend: {
      display: true,
      position: "bottom",
    },
  };

  useEffect(() => {
    fetchBranch();
  }, []);

  return <Doughnut data={data} options={options} />;
};
export default DoughnutChart;
