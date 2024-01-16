type Props = {
    selectedPrice?: number;
    onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return(
        <div>
            <h4 className="text-md font-semibold mb-2">
                <select className="p-2 border rounded-md w-full" value={selectedPrice} onChange={(event)=>onChange(event.target.value ? parseInt(event.target.value) : undefined)}>
                    <option value="">Select a max Price</option>    {/*The event parameter is a synthetic event object provided by React. It contains information about the event, such as the target element (event.target), the type of event (event.type), and other properties. In this case, event.target.value is used to get the selected value from the select element.*/}
                    {[50,100,200,300,400,500].map((price) => (
                        <option value={price}>{price}</option>
                    ))}
                </select>
            </h4>
        </div>
    )
};

export default PriceFilter;