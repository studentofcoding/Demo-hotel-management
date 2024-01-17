export type HotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
  };

  export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };

  export type UserType = {      //here the same type used here is used in userSchema below it is because for keep the correct type of the data within the project
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
