interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm p-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
