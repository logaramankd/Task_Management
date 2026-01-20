import { useState } from "react";
import Input from "./Input";
import Button from "./Button";

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
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Backend API will be connected here later
    if (type === "signup") {
      console.log("Signup Data:", form);
    } else {
      console.log("Login Data:", form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 min-h-[300px]">
      {type === "signup" && (
        <>
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name}</p>
          )}
        </>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email}</p>
      )}

      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password}</p>
      )}

      <Button text={type === "signup" ? "Create Account" : "Login"} />
    </form>
  );
}
