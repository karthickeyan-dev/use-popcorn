export default function Button({ children, handleClick }) {
  return (
    <button className="btn-pagination" onClick={handleClick}>
      {children}
    </button>
  );
}
