    import React, { useContext } from "react";

    type SearchContext = {
        destination: string;
        checkIn: Date;
        checkOut: Date;
        adultCount: number;
        childCount: number;
        hotelId: string;
        saveSearchValues: (
        destination: string,
        checkIn: Date,
        checkOut: Date,
        adultCount: number,
        childCount: number,
        ) => void;
    };

        const SearchContext = React.createContext<SearchContext | undefined>(undefined);

        type SearchContextProviderProps = {
            children: React.ReactNode;
            
        };

        export const SearchContextProvider = ({ children }: SearchContextProviderProps) => {

            const [destination, setDestination] = React.useState<string>(()=>sessionStorage.getItem("destination") || "");   //here we are using sessionStorage to store the data in the browser so that when the user refreshes the page the data is not lost
            const [checkIn, setCheckIn] = React.useState<Date>(()=>new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()));   //here we are using sessionStorage to store the data in the browser so that when the user refreshes the page the data is not lost
            const [checkOut, setCheckOut] = React.useState<Date>(()=>new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()));
            const [adultCount, setAdultCount] = React.useState<number>(()=>parseInt(sessionStorage.getItem("adultCount") || "1"));
            const [childCount, setChildCount] = React.useState<number>(()=>parseInt(sessionStorage.getItem("childCount") || "0"));
            const [hotelId, setHotelId] = React.useState<string>(()=>sessionStorage.getItem("hotelId") || "");

            const saveSearchValues = (     //these values are what all the related components are using, https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=15&t=18000s at 12.28.24
                destination: string,
                checkIn: Date,
                checkOut: Date,
                adultCount: number,       //for better understanding refer the video https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=18&t=18000s at 9.25.50
                childCount: number,
                hotelId?: string,
            ) => {
                setDestination(destination);   //and this is where we are setting this state currently, https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=15&t=18000s at 12.28.30
                setCheckIn(checkIn);
                setCheckOut(checkOut);
                setAdultCount(adultCount);
                setChildCount(childCount);
                if (hotelId) {
                setHotelId(hotelId);
                }

                sessionStorage.setItem("destination", destination);   //here we are storing the data in the browser so that when the user refreshes the page the data is not lost
                sessionStorage.setItem("checkIn", checkIn.toISOString());
                sessionStorage.setItem("checkOut", checkOut.toISOString());
                sessionStorage.setItem("adultCount", adultCount.toString());
                sessionStorage.setItem("childCount", childCount.toString());
                if (hotelId) {
                sessionStorage.setItem("hotelId", hotelId);
                }
            };

            return(
                <SearchContext.Provider
                    value={{
                        destination,
                        checkIn,
                        checkOut,
                        adultCount,
                        childCount,
                        hotelId,
                        saveSearchValues,
                    }}
                    >
                    {children}
                </SearchContext.Provider>
            )};

        export const useSearchContext = () => {
            const context = useContext(SearchContext);
            return context as SearchContext;
        };