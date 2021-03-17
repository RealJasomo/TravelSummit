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


export interface Option{
    label: string;
    value: string;
}