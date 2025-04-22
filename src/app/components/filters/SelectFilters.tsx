interface SelectFilter {
  title: string;
  onClick: () => void;
  isSelected: boolean
}

interface SelectFiltersProps {
  filters: Array<SelectFilter>;
  isExpanded: boolean
}

export function SelectFilters({ filters, isExpanded }: SelectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ title, onClick, isSelected }, index) => {
        return (
          <button
            key={index}
            onClick={onClick}
            className={`px-3 py-1 my-2 md:my-0 text-xs md:text-sm font-medium rounded-md hover:cursor-pointer ${
              isSelected
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={!isExpanded}
          >
            {title}
          </button>
        )
      })}
    </div>
  )
}