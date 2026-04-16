import StarRating from "../Components/StarRating";
export default function StarRating({ rating, setRating, disabled }) {
  return (
    <div>
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          onClick={() => !disabled && setRating(star)}
          style={{
            color: star <= rating ? "gold" : "#ccc",
            cursor: disabled ? "not-allowed" : "pointer",
            fontSize: "18px"
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}