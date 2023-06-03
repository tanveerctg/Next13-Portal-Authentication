"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  return (
    <>
      <div>Dashboard</div>
      <button
        onClick={() => {
          fetch("../api/logout", {
            method: "POST",
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              console.log({ res });
              if (res.ok) {
                return router.push("/login");
              }
            });
        }}
      >
        Log Out
      </button>
    </>
  );
};

export default Dashboard;
