export function Spinner() {
  return (
    <div
      style={{
        width: "16px",
        height: "16px",
        border: "3px solid rgba(255,255,255,0.4)",
        borderTopColor: "white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );
}
