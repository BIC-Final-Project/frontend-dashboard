import { useNavigate } from "react-router-dom";
import ButtonPrimary from "../Button/ButtonPrimary";

const TableFooter = ({ current_page, max_page, limit, path }) => {
  const navigate = useNavigate()

  const handlePreviousPage = () => {
    navigate(`/app/${path}?page=${current_page - 1}&limit=${limit}`)
  }

  const handleNextPage = () => {
    navigate(`/app/${path}?page=${current_page + 1}&limit=${limit}`)
  }

  return (
    <div className="flex !w-full items-center justify-between px-8 py-4">
      <ButtonPrimary
        disabled={current_page === 1 || current_page === 0}
        onClick={handlePreviousPage}
        variant="custom"
        className="rounded-md border border-strokeColor bg-white !p-[10px_16px]"
      >
        Previous
      </ButtonPrimary>
      <h1>
        Page {current_page === 0 ? 1 : current_page} of {max_page === 0 ? 1 : max_page}
      </h1>
      <ButtonPrimary
        disabled={current_page === max_page}
        onClick={handleNextPage}
        variant="custom"
        className="rounded-md border border-strokeColor bg-white !p-[10px_16px]"
      >
        Next
      </ButtonPrimary>
    </div>
  );
};

export default TableFooter;
