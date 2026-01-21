import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { loginUser, signupUser } from "../services/api";

export default function AuthTabs({ type }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (type === "signup" && !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (type === "signup") {
        await signupUser(form);
        alert("Signup successful. Please login.");
      } else {
        const res = await loginUser(form);

        // ✅ FIXED LINE
        if (res.token) {
          localStorage.setItem("token", res.token);
          window.location.href = "/dashboard";
        } else {
          alert("Login failed");
        }
      }
    } catch (err) {
      alert("Invalid credentials or server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 min-h-[300px]">
      {type === "signup" && (
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />

      <Button text={type === "signup" ? "Create Account" : "Login"} />
    </form>
  );
}
