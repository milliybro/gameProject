import React, { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { request } from "../../request";
import "./AllHistory.scss";

interface DataType {
  id: string; // Add the id property if it exists in your data
  key: string;
  category: Category;
  count: number; // Changed from 'count' to 'score'
  time: string; // Assuming 'time' is a string in the format "YYYY-MM-DD HH:MM:SS"
  is_win: string; // Assuming 'is_win' is a boolean
}
interface Category {
  name: string;
  // Add other properties if they exist in your data
}

const AllHistory: React.FC = () => {
  const [userData, setUserData] = useState<DataType[]>([]); // Initialize as an array

  const getData = async () => {
    try {
      const res = await request.get(`user/historys/`);
      setUserData(res.data); // Set the array of user data
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns: TableColumnsType<DataType> = [
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Score",
      dataIndex: "count", // Changed from 'count' to 'score'
      sorter: {
        compare: (a, b) => a.count - b.count,
        multiple: 2,
      },
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "isWin",
      dataIndex: "is_win",
    },
  ];

  const data = userData.map((item) => ({
    id: item.id,
    key: item.id,
    category: item.category ? item.category.name : "Unknown", // Handle null category
    count: item.count,
    time: new Date(item.time).toLocaleString("en-US", {
      timeZone: "Asia/Tashkent", // Adjusted to Uzbekistan time zone
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    is_win: item.is_win ? "Win" : "Lost",
  }));
  


  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div style={{ height: "800px" }}>
      <Table
        columns={columns}
        dataSource={data} // Use userData directly
        onChange={onChange}
      />
    </div>
  );
};

export default AllHistory;
