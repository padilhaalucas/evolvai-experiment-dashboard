import { ReactNode } from "react";
import { SelectFilters } from "@/app/components";

interface BaseProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  filters?: {title: string, onClick: () => void, isSelected: boolean}[]
}

interface SubSectionHeaderProps extends BaseProps {
  children?: ReactNode;
}

interface SubSectionHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}

export function SubSectionHeader({
  title,
  isExpanded,
  onToggle,
  children = null
}: SubSectionHeaderProps) {
  return (
    <div className="flex flex-col space-y-0 md:space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 hover:cursor-pointer" onClick={onToggle}>
          <button
            className="relative p-1.5 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-all duration-200 focus:outline-none group"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-gray-500 transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <h3 className="text-md font-bold text-gray-700">{title}</h3>
        </div>
      </div>

      {children && (
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function SectionHeader({ onToggle, isExpanded, title, filters }: BaseProps) {
  return (
    <div className="flex flex-col space-y-0 md:space-y-2">
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-bold text-gray-900 hover:cursor-pointer"
          onClick={onToggle}
        >
          {title}
        </h2>

        <button
          onClick={onToggle}
          className="relative p-1.5 rounded-full hover:bg-gray-100 hover:cursor-pointer transition-all duration-200 focus:outline-none group"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? `Collapse ${title} section` : `Expand ${title} section`}
          title={isExpanded ? "Collapse" : "Expand"}
        >
          <span className="absolute inset-0 rounded-full bg-gray-200 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-500 transition-transform duration-500 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {filters && filters?.length > 0 && (
        <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <SelectFilters filters={filters} isExpanded={isExpanded} />
        </div>
      )}
    </div>
  )
}