const TypingIndicator = () => {
    return (
        <div className="flex self-start gap-1 px-3 py-3 bg-gray-200 rounded-xl">
            <Dot />
            <Dot className="[animation-delay:0.2s]" />
            <Dot className="[animation-delay:0.4s]" />
        </div>
    );
};

type DotProps = {
    className?: string;
};

const Dot = ({ className }: DotProps) => {
    return (
        <div
            className={`${className} w-2 h-2 rounded-full bg-gray-600 animate-pulse`}
        />
    );
};

export default TypingIndicator;
