"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [password_repeat, set_password_repeat] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  return (
    <div>
      <input
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <input
        placeholder="Password Repeat"
        onChange={(e) => {
          set_password_repeat(e.target.value);
        }}
        value={password_repeat}
      />
      <button
        onClick={async () => {
          const getToken = await fetch("../api/getToken");
          const response = await getToken.json();
          const record_id = response.token.record_id;
          console.log({ record_id });
          fetch("../api/reset_password", {
            method: "POST",
            body: JSON.stringify({
              password,
              password_repeat,
              record_id,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              console.log({ res });
              router.push(res.go_to);
              // if (res.ok) {
              //   return router.push(res.go_to);
              // }
            });
        }}
      >
        Save
      </button>
    </div>
  );
};

export default ResetPassword;
