import { FiStar } from 'react-icons/fi';

export default function StarRating({ rating, onRate, size = 18, readonly = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate?.(star)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          disabled={readonly}
        >
          <FiStar
            size={size}
            className={`transition-colors ${
              star <= rating
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
