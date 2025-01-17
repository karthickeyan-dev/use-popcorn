import Button from './Button';

export default function Pagination({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}) {
  return (
    <div className="pagination">
      {currentPage !== 1 && (
        <Button handleClick={onPreviousPage}>Previous</Button>
      )}
      <p>{currentPage}</p>
      {currentPage !== totalPages && (
        <Button handleClick={onNextPage}>Next</Button>
      )}
    </div>
  );
}
