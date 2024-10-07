"use client";


interface ButtonConfirmProps {
  label?: string,
  type?: "button" | "submit" | "reset",
  disabled?: boolean,
  outline?: boolean,
  small?: boolean,
  custom?: string,
  icon?: React.ReactNode,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
  loading?: boolean,
}

const ButtonConfirm: React.FC<ButtonConfirmProps> = (
  {
    label,
    type,
    disabled,
    outline,
    small,
    custom,
    icon,
    onClick,
    loading
  }
) => {
  return (
    <button onClick={onClick} type={type} disabled={disabled} className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-md hover:opacity-80 transition w-full border-lime-900 flex items-center justify-center gap-2 
    ${outline ? "bg-green-50" : "bg-lime-900"} ${outline ? "hover:bg-lime-900" : "hover:bg-green-50"} ${outline ? "text-lime-900" : "text-green-50"} ${outline ? "hover:text-green-50" : "hover:text-lime-900"} 
    ${small ? "text-sm font-light" : "text-base font-semibold"} ${small ? "py-1 px-2 border-[1px]" : "py-3 px-4 border-2"} ${custom ? custom : ""}`}>
      {loading ? 'Please wait..' : label} {loading ? <span className="loading loading-ring loading-md"></span> : icon}
    </button>
  );
}

export default ButtonConfirm;