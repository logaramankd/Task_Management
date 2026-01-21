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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (type === "signup") {
                const res = await signupUser(form);
                alert("Signup successful. Please login.");
            } else {
                const res = await loginUser(form);

                if (res.token) {
                    localStorage.setItem("token", res.token);
                    window.location.href = "/dashboard";
                } else {
                    alert("Login failed");
                }
            }
        } catch (err) {
            alert("Something went wrong");
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
