import React, { ButtonHTMLAttributes, ReactNode } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) =>{ 
    return(
        <>
        <button {...props} className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded-4xl transform active:scale-90 transition-transform duration-300 cursor-pointer mb-4">{children}</button></>
    )
}

export default Button