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
        <Button classProp="pagination-prev" handleClick={onPreviousPage}>
          Previous
        </Button>
      )}
      {totalPages !== 1 && <p className="pagination-curr">{currentPage}</p>}
      {currentPage !== totalPages && (
        <Button classProp="pagination-next" handleClick={onNextPage}>
          Next
        </Button>
      )}
    </div>
  );
}
