import { FaStar } from "react-icons/fa6";

type StarRatingProps = {
    value: GLfloat;
};

const StarRating = ({ value }: StarRatingProps) => {
    const placeholders = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1">
            {placeholders.map((p) => (
                <FaStar key={p} />
            ))}
        </div>
    );
};

export default StarRating;
