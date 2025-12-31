export default function Input({ placeholder, type = "text", value, className, onChange, ...props}) {
  return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`cursor-none ${className}`}
        {...props}
      />
  );
}