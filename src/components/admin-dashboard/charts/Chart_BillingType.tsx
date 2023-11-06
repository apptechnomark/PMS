import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Import the Highcharts modules you need (e.g., variable-pie)
import HighchartsVariablePie from "highcharts/modules/variable-pie";

// Initialize the variable pie chart module
if (typeof Highcharts === "object") {
  HighchartsVariablePie(Highcharts);
}
interface Chart_BillingTypeProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
  sendData: any;
}

const Chart_BillingType: React.FC<Chart_BillingTypeProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
  sendData,
}) => {
  const [data, setData] = useState<any | any[]>([]);

  // API for Dashboard Summary
  useEffect(() => {
    const getBillingTypeData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/dashboard/billingstatusgraph`,
          {
            WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
          },
          {
            headers: {
              Authorization: `bearer ${token}`,
              org_token: `${Org_Token}`,
            },
          }
        );

        if (response.status === 200) {
          if (response.data.ResponseStatus === "Success") {
            const chartData = response.data.ResponseData.map(
              (item: { Percentage: any; Key: any; Value: any }) => ({
                name: item.Key,
                y: item.Value,
                percentage: item.Percentage,
              })
            );

            setData(chartData);
          } else {
            const data = response.data.Message;
            if (data === null) {
              toast.error("Please try again later.");
            } else {
              toast.error(data);
            }
          }
        } else {
          const data = response.data.Message;
          if (data === null) {
            toast.error("Please try again.");
          } else {
            toast.error(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    getBillingTypeData();
  }, [onSelectedWorkType]);

  // Define the chart options
  const chartOptions = {
    chart: {
      type: "variablepie",
      width: 480,
      height: 240,
      spacingTop: 10,
    },
    title: {
      text: null,
    },
    tooltip: {
      headerFormat: "",
      pointFormat:
        '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
        "Count: <b>{point.y}</b><br/>" +
        "Percentage: <b>{point.percentage}</b><br/>",
    },
    plotOptions: {
      variablepie: {
        dataLabels: {
          enabled: false,
        },
        cursor: "pointer",
        point: {
          events: {
            click: (event: { point: { name: any } }) => {
              const selectedPointData = {
                name: (event.point && event.point.name) || "",
              };
              sendData(true, selectedPointData.name);
            },
          },
        },
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
      width: 150,
      itemMarginBottom: 10,
    },
    series: [
      {
        type: "variablepie",
        minPointSize: 30,
        innerSize: "60%",
        zMin: 0,
        name: "projects",
        borderRadius: 4,
        showInLegend: true,
        data: data,
      },
    ],
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="flex flex-col px-[20px]">
      <span className="flex items-start pt-[30px] px-[10px] text-lg font-medium">
        Billing Type
      </span>
      <div className="flex justify-between relative">
        <div className="mt-5">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Chart_BillingType;