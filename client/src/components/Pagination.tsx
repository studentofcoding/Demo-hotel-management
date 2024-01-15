export type Props = {
    page: number;
    pages: number;
    onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {
    const pageNumbers = [];
    for(let i = 1; i <= pages; i++) {      //here we are creating an array of page numbers and then we will map over it to show the pageNumbers array
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center">
            <ul className="flex border border-slate-300">
                {pageNumbers.map((number) => (
                    <li className={`px-2 py-1 ${page === number ? "bg-gray-200" : ""}`}>
                        <button onClick={()=> onPageChange(number)}>{number}</button>    {/*compare this with ImagesSection.tsx if there there is any understanding issue with onClick={()=> onPageChange(number)} part */}
                    </li>
                ))}
            </ul>
        </div>
    )
};

export default Pagination;

//TODO: when the page number is clicked the new page is loaded without any issue but the page is not scrolled to the top so we need to fix that