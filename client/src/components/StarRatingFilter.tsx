type Props = {
    selectedStar: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;    //this is the type for an event when the checkbox is clicked
}

const StarRatingFilter = ({ selectedStar, onChange }: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Property Rating</h4>
            {["5", "4", "3", "2", "1"].map((star) => (
                <label className="flex items-center space-x-2">  {/*here we are using the space-x-2 class to add a space of 0.5rem between the checkbox and the text*/}
                    <input type="checkbox" className="rounded" value={star} checked={selectedStar.includes(star)} onChange={onChange}/>   {/* here "checked={selectedStar.includes(star)}" is used check whether the selectedStars which received from state where all the stars the user has selected so far contains the current star this map function currently on, if does then the checked will be true */}
                    <span>{star} stars</span>  {/*he checked attribute is determined by whether the current star is included in the selectedStar array*/}
                </label>
            ))}
        </div>
    )
};

export default StarRatingFilter;