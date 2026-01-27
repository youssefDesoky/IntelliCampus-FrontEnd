import { EyeIcon, EyeSlashIcon } from "./icons";
import { useState } from "react";


export default function InputItem({ label, type = "text", name, value, onChange, placeholder = "", className = "", children }) {    
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;
    const [isInputFocused, setIsInputFocused] = useState(false);

    return (
        <div className={`input-item ${className}`}>
            <label htmlFor={name} className="block mb-2 font-bold text-sm text-text-primary-active-light dark:text-text-primary-active-dark">
                {label}
            </label>
            
            <div className={`flex items-center border ${isInputFocused ? "border-border-accent-active-light dark:border-border-accent-active-dark" : "border-border-primary-default-light dark:border-border-primary-default-dark"} rounded-md px-3 w-full max-w-md`}>
                {children}
                <input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full outline-none px-3 py-2 border-border-accent-default-light dark:border-border-accent-default-dark rounded-md text-text-primary-active-light dark:text-text-primary-active-dark focus:outline-none"
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    autoComplete="off"
                />
                {type === "password" && (
                    <button type="button" className={`${!value || value.length === 0 ? "hidden" : ""} text-sm text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-active-light dark:hover:text-icon-secondary-active-dark`} onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </div>
    );
}