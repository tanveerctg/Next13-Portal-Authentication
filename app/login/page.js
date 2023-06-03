"use client";
import { TextField } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { sign } from "../lib/utils.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  return (
    <div>
      <input
        placeholder="email"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      <input
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <button
        onClick={async () => {
          fetch("../api/login", {
            method: "POST",
            body: JSON.stringify({
              email,
              password,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              console.log({ res });
              if (res.ok) {
                return router.push(res.go_to);
              }
            });
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Login;
