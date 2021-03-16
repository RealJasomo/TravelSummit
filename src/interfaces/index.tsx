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