const Pagination = ({
  totalPage,
  currentPage,
  handleNextPrev,
  handlePagination,
}) => {
  const getPaginationItems = () => {
    let pages = [];

    if (totalPage <= 5) {
      pages = Array.from({ length: totalPage }, (_, idx) => idx + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, "...", totalPage];
      } else if (currentPage >= totalPage - 2) {
        pages = [1, "...", totalPage - 2, totalPage - 1, totalPage];
      } else {
        pages = [
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPage,
        ];
      }
    }

    return pages;
  };

  const paginationItems = getPaginationItems();

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {totalPage > 0 && (
        <>
          {/* Previous Button */}
          <div
            className={`cursor-pointer bg-white text-gray-500 h-[30px] w-[30px] lg:h-[60px] lg:w-[60px] rounded flex items-center justify-center ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleNextPrev(0)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>

          {/* Pagination Items */}
          {paginationItems.map((page, idx) => (
            <div
              key={idx}
              className={`${
                page === currentPage
                  ? "cursor-pointer bg-primary text-white"
                  : "cursor-pointer bg-white text-gray-500"
              } h-[30px] w-[30px] lg:h-[60px] lg:w-[60px] rounded flex items-center justify-center`}
            >
              {typeof page === "number" ? (
                <button onClick={() => handlePagination(page)}>{page}</button>
              ) : (
                <span>{page}</span>
              )}
            </div>
          ))}

          {/* Next Button */}
          <div
            className={`cursor-pointer bg-white text-gray-500 h-[30px] w-[30px] lg:h-[60px] lg:w-[60px] rounded flex items-center justify-center ${
              currentPage === totalPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => handleNextPrev(totalPage + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};
