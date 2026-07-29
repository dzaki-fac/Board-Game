export default function LanguageToggle({ bahasa, setBahasa }) {
    const isEN = bahasa === "EN";

    return (
        <button
            type="button"
            onClick={() => setBahasa(isEN ? "ID" : "EN")}
            className="relative w-[68px] h-[30px] rounded-full flex items-center"
            style={{ backgroundColor: "#EAF1F6" }}
            aria-label="Toggle language"
        >
            <span
                className="absolute top-[3px] left-[3px] w-[31px] h-[24px] rounded-full shadow-sm transition-transform duration-300 ease-in-out z-10"
                style={{
                    backgroundColor: "#0E4A73",
                    transform: isEN ? "translateX(0)" : "translateX(31px)",
                }}
            />
            <span
                className="relative z-20 flex-1 text-center text-[10px] font-bold leading-none transition-colors duration-300"
                style={{ color: isEN ? "#FFFFFF" : "#0E4A73" }}
            >
                EN
            </span>
            <span
                className="relative z-20 flex-1 text-center text-[10px] font-bold leading-none transition-colors duration-300"
                style={{ color: !isEN ? "#FFFFFF" : "#0E4A73" }}
            >
                ID
            </span>
        </button>
    );
}