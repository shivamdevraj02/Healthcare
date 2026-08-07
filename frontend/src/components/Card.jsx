export default function Card({ title, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="font-semibold text-ink mb-3">{title}</h3>}
      {children}
    </div>
  );
}
