import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
    selectedFacilities: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;    //this is the type for an event when the checkbox is clicked
}

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className="text-md font-semibold mb-2">Facilities</h4>
            {hotelFacilities.map((facility) => (
                <label className="flex items-center space-x-2">  {/*here we are using the space-x-2 class to add a space of 0.5rem between the checkbox and the text*/}
                    <input type="checkbox" className="rounded" value={facility} checked={selectedFacilities.includes(facility)} onChange={onChange}/>   {/* here "checked={selectedStar.includes(star)}" is used check whether the selectedStars which received from state where all the stars the user has selected so far contains the current star this map function currently on, if does then the checked will be true */}
                    <span>{facility}</span>  {/*he checked attribute is determined by whether the current hotel is included in the selectedStar array*/}
                </label>
            ))}
        </div>
    )
};

export default FacilitiesFilter;