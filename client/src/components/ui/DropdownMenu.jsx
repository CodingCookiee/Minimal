import * as React from "react"
import { cn } from "../../utils/cn.js"

const DropdownMenu = React.forwardRef(({ children, ...props }, ref) => (
  <div ref={ref} className="relative inline-block text-left" {...props}>
    {children}
  </div>
))
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("inline-flex justify-center", className)}
    {...props}
  />
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
      className
    )}
    {...props}
  />
))
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}