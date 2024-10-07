interface MenuItemProps {
  className?: string,
  children: React.ReactNode,
  onClick: () => void
}

const MenuItem: React.FC<MenuItemProps> = ({ children, onClick, className }) => {
  return (
    <div className="px-4 py-3 hover:bg-neutral-100 transition" onClick={onClick} >
      <div className={className}>
        {children}
      </div>
    </div >
  );
}

export default MenuItem;