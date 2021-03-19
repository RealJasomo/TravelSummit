export interface DateError {
    inbound: boolean,
    outbound: boolean, 
    message: string[]
}

export interface Currency {
    Code: string,
    Symbol: string,
    ThousandsSeparator: string,
    DecimalSeperator: string,
    SymbolOnLeft: boolean,
    SpaceBetweenAmountAndSymbol: boolean,
    RoundingCoefficient: number,
    DecimalDigits: number
}

export interface Country{
    Code: string,
    Name: string
}

export interface Airport{
    PlaceId: string,
    PlaceName: string,
    CountryId: string,
    RegionId: string,
    CityId: string,
    CountryName: string
}


export interface Option<T>{
    label: string;
    value: T;
}

export interface Carrier{
    CarrierId: number,
    Name: string
}

export interface Quote{
    QuoteId: number,
    MinPrice: number,
    Direct: boolean,
    QuoteDateTime: string,
    OutboundLeg: Leg,
    InboundLeg?: Leg,
    cheapest?: boolean

}

export interface Leg{
    CarrierIds: number[]
    OriginId: number,
    DestinationId: number,
    DepartureDate: string
}