function CardLayout({ children, className }) {
  return <div className={`card-container ${className ?? ""}`}>{children}</div>;
}

export default CardLayout;
