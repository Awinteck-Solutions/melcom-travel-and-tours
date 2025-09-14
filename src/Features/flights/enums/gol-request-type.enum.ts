// GOL API related request types
export enum GOLRequestTypeEnum {
        SEARCH_FLIGHTS = 'SearchFlightsRequest_1',
        SEARCH_FLIGHTS_EXTENDED = 'SearchFlightsExtendedRequest_2',
        BOOK_RESERVATIONS = 'BookReservationsRequest_1',
        BOOK_RESERVATIONS_V2 = 'BookReservationsRequest_2',
        BOOK_RESERVATIONS_V3 = 'BookReservationsRequest_3',
        LIST_RESERVATIONS = 'ListReservationsRequest_1',
        DETAIL_RESERVATIONS = 'DetailReservationsRequest_1',
        CANCEL_RESERVATIONS = 'CancelReservationsRequest_1',
        CREATE_PASSENGER = 'CreatePassengerRequest_1',
        MODIFY_PASSENGER = 'ModifyPassengerRequest_1',
        PRICE_ACTUALIZATION = 'PriceActualizationRequest_1'
}
