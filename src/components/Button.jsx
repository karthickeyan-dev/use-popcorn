export default function Button({ children, handleClick, classProp }) {
  return (
    <button className={`btn-pagination ${classProp}`} onClick={handleClick}>
      {children}
    </button>
  );
}
