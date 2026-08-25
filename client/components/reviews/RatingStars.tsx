type RatingStarsProps = {
  rating: number;
  showValue?: boolean;
};

export default function RatingStars({
  rating,
  showValue = true,
}: RatingStarsProps) {
  const filledStars = Math.round(rating);

  return (
    <div
      aria-label={`${rating} out of 5 stars`}
      className="flex items-center gap-1"
    >
      <div className="flex items-center" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={`text-base leading-none ${
              index < filledStars ? "text-accent" : "text-border"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {showValue ? (
        <span className="ml-1 text-sm font-extrabold text-primary">
          {rating.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}