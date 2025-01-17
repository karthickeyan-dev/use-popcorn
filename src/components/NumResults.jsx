export default function NumResults({ totalResults }) {
  return (
    <p className="num-results">
      Found <strong>{totalResults}</strong> results
    </p>
  );
}
