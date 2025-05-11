export function Label({ htmlFor, label }) {
  return <label htmlFor={htmlFor}>{label}</label>;
}

export function InputText({
  htmlFor,
  placeholder,
  value,
  onChange,
  required = true,
  ...rest
}) {
  return (
    <input
      id={htmlFor}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
    />
  );
}

export function InputSelect({
  htmlFor,
  name,
  options,
  placeholder,
  value,
  onChange,
  required = true,
  ...rest
}) {
  return (
    <select
      name={name}
      id={htmlFor}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
    >
      <option value="" disabled>
        - Pilih {placeholder} -
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function InputDate({
  htmlFor,
  min,
  max,
  value,
  onChange,
  required = true,
  ...rest
}) {
  return (
    <input
      id={htmlFor}
      type="date"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      required={required}
      {...rest}
    />
  );
}

export function InputNumber({
  htmlFor,
  placeholder,
  value,
  onChange,
  minLength = 0,
  maxLength = 999,
  required = true,
  ...rest
}) {
  return (
    <input
      id={htmlFor}
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      minLength={minLength}
      maxLength={maxLength}
      required={required}
      {...rest}
    />
  );
}
