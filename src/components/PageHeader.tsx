import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  action?: {
    label: string;
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
  };
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  deleteAction?: {
    label: string;
    onDelete: () => void;
  };
}

export function PageHeader({
  title,
  description,
  badge,
  children,
  actions,
  action,
  setIsOpen,
  deleteAction,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
      <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight flex items-center gap-3">
          {title}
          {badge && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[#ee6a2c]">
              {badge}
            </span>
          )}
        </h1>
        {description && (
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {deleteAction && (
          <button
            type="button"
            onClick={deleteAction.onDelete}
            className="inline-flex items-center gap-2 px-6 py-3 border border-red-100 text-red-500 font-semibold rounded-full hover:bg-red-50 transition-all cursor-pointer text-sm whitespace-nowrap shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            {deleteAction.label}
          </button>
        )}

        {action &&
          (action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee6a2c] text-white font-semibold rounded-xl hover:bg-[#d4561b] transition-all shadow-md shadow-[#ee6a2c]/20 hover:shadow-lg active:scale-[0.99] cursor-pointer text-sm whitespace-nowrap shrink-0"
            >
              {action.icon ? action.icon : <Plus className="h-4 w-4" strokeWidth={2.5} />}
              {action.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (action.onClick) {
                  action.onClick();
                } else {
                  setIsOpen?.(true);
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee6a2c] text-white font-semibold rounded-xl hover:bg-[#d4561b] transition-all shadow-md shadow-[#ee6a2c]/20 hover:shadow-lg active:scale-[0.99] cursor-pointer text-sm whitespace-nowrap shrink-0"
            >
              {action.icon ? action.icon : <Plus className="h-4 w-4" strokeWidth={2.5} />}
              {action.label}
            </button>
          ))}

        {actions}
        {children}
      </div>
    </header>
  );
}
