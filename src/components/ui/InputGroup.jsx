export default function InputGroup({
  label,
  inputId,
  inputType = "text",
  inputStyles = "",
  className = "",
  children,
  placeholder = "",
  button,
  readOnly = false,
  value,
  name
}) {
  const baseInputCls =
    "w-full rounded-lg px-4 py-3 text-sm text-gray-800 bg-gray-100 placeholder-gray-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-100";
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={inputId} className={`text-sm font-medium text-gray-600 mb-2 cursor-none`}>
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          type={inputType}
          className={`${baseInputCls} ${inputStyles} cursor-none`}
          placeholder={placeholder}
          readOnly={readOnly}
          value={value ?? ""}
          aria-readonly={readOnly}
          name={name}
        />
        {button && children}
      </div>
    </div>
  );
}