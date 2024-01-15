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

            const [destination, setDestination] = React.useState<string>("");
            const [checkIn, setCheckIn] = React.useState<Date>(new Date());
            const [checkOut, setCheckOut] = React.useState<Date>(new Date());
            const [adultCount, setAdultCount] = React.useState<number>(1);
            const [childCount, setChildCount] = React.useState<number>(0);
            const [hotelId, setHotelId] = React.useState<string>("");

            const saveSearchValues = (
                destination: string,
                checkIn: Date,
                checkOut: Date,
                adultCount: number,       //for better understanding refer the video https://www.youtube.com/watch?v=YdBy9-0pER4&list=PLpH4xB252nMF-I26wZ0RRZ3OtdZk_qGtd&index=18&t=18000s at 9.25.50
                childCount: number,
                hotelId?: string,
            ) => {
                setDestination(destination);
                setCheckIn(checkIn);
                setCheckOut(checkOut);
                setAdultCount(adultCount);
                setChildCount(childCount);
                if (hotelId) {
                setHotelId(hotelId);
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