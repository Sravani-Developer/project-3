function FormField({ label, error, children }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error && <strong>{error}</strong>}
    </label>
  );
}

export default FormField;
