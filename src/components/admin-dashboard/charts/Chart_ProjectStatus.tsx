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
interface Chart_ProjectStatusProps {
  onSelectedProjectIds: number[];
  onSelectedWorkType: number;
  sendData: any;
}

const Chart_ProjectStatus: React.FC<Chart_ProjectStatusProps> = ({
  onSelectedProjectIds,
  onSelectedWorkType,
  sendData,
}) => {
  const [data, setData] = useState<any | any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // API for Project Status
  useEffect(() => {
    const getProjectStatusData = async () => {
      const token = await localStorage.getItem("token");
      const Org_Token = await localStorage.getItem("Org_Token");
      try {
        const response = await axios.post(
          `${process.env.report_api_url}/dashboard/projectstatusgraph`,
          {
            WorkTypeId: onSelectedWorkType === 0 ? null : onSelectedWorkType,
            ProjectId:
              onSelectedProjectIds.length === 0 ? null : onSelectedProjectIds,
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
            const chartData = response.data.ResponseData.List.map(
              (item: {
                Percentage: any;
                Key: any;
                Value: any;
                ColorCode: any;
              }) => ({
                name: item.Key,
                y: item.Value,
                percentage: item.Percentage,
                ColorCode: item.ColorCode,
              })
            );

            setData(chartData);
            setTotalCount(response.data.ResponseData.TotalCount);
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

    getProjectStatusData();
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
        colors: data.map((item: { ColorCode: string }) => item.ColorCode),
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
        Project Status
      </span>
      <div className="flex justify-between relative">
        <div className="mt-5">
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        {data.length > 0 && (
          <span
            className={`flex flex-col items-center absolute bottom-[5.9rem] z-0 ${
              totalCount <= 1 ? "left-[8.45rem]" : "left-[8.35rem]"
            }`}
          >
            <span className="text-xl font-semibold text-darkCharcoal">
              {totalCount}
            </span>
            <span className="text-lg text-slatyGrey">
              {totalCount > 1 ? "Tasks" : "Task"}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Chart_ProjectStatus;