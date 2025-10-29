function AnimatedIconButton({ onClick, label, animation, shape, isActive }){
    return (
        <button
            onClick={onClick}
            className={`group flex items-center text-secondary md:pl-4 ${animation} relative ${isActive ? 'bg-primary text-secondary' : ''}`}
            aria-label={label}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 sm:ml-1"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={shape}
                />
            </svg>
            <span className={`max-sm:hidden overflow-hidden opacity-0 max-w-0 sm:group-hover:max-w-xs sm:group-hover:opacity-100 transition-all duration-1000 ease-in-out ${isActive? 'max-w-xs opacity-100' : ''}`}>
                <span className="pl-2 whitespace-nowrap">{label}</span>
            </span>
        </button>
    );
}


export default AnimatedIconButton;