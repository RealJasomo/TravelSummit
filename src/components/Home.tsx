import React, { Component } from 'react'
import { CurrencyContext, MarketContext, QuoteCard } from '.'
import { IconButton, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import AsyncSelect from 'react-select/async'
import Axios from 'axios'

import { Airport, Carrier, Country, Currency, DateError, Option, Quote } from '../interfaces'

import SendIcon from '@material-ui/icons/Send'
import SortIcon from '@material-ui/icons/Sort'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'

import styles from '../css/home.module.css'
import { apiHeader } from './util/apiHeader'




interface HomeState{
    roundtrip: boolean,
    outbound: string,
    inbound: string,
    error?: DateError,
    country: Country | null,
    currency: Currency | null,
    currencySubmitted: Currency | null,
    origin: Airport | null,
    destination: Airport | null,
    quotes: Quote[] | null,
    carriers: Carrier[] | null,
    cheapestSort: boolean,
    originOption: Option | null,
    destinationOption: Option | null

}

type StateWrapper<T> = {
    [K in keyof T]: T[K]
} 


export default class Home extends Component<{}, StateWrapper<HomeState>> {

    constructor(props: {}){
        super(props);
        this.state = {
            roundtrip: true,
            outbound: '',
            inbound: '',
            country: null,
            currency: null,
            currencySubmitted: null,
            origin: null,
            destination: null,
            quotes: null,
            carriers: null,
            cheapestSort: true,
            originOption: null,
            destinationOption: null
        }
    }

    loadOptions = (query: string) => {  
        return Axios.get(
                `${process.env.REACT_APP_API_URL}/autosuggest/v1.0/${this.state.country?.Code ?? 'US'}/${this.state.currency?.Code ?? 'USD'}/en-US/`
                ,{
                    headers: apiHeader,
                    params: { query }
                }).then(res => res.data.Places).then((airports : Airport[]) => airports.map(airport => ({
            label: `${airport.PlaceId} - ${airport.PlaceName}`,
            value: JSON.stringify(airport)
        })));
    }

    handleCountryChange = (_: React.ChangeEvent<{}>, country: Country | null) => {
        this.setState({ country });
    }

    handleFlightType = (event: React.ChangeEvent<HTMLInputElement>, value: string ) => {
        this.setState({roundtrip: value==='true', inbound: ''});
    }

    handleAirportSwap = () =>{
        this.setState({
                        origin: this.state.destination, 
                        destination: this.state.origin, 
                        originOption: this.state.destinationOption,
                        destinationOption: this.state.originOption
                    })
    }

    handleDateChange = <K extends keyof HomeState>(type: K) => async (event: React.ChangeEvent<HTMLInputElement>) =>{
       await this.setState({...this.state, [type]: event.currentTarget.value} as StateWrapper<HomeState>);
       this.verifyDates();
    }

    handleCurrencyChange = (event: React.ChangeEvent<{}>, currency: Currency | null) => {
        this.setState({ currency });
    }

    handleToggleSort = () => {
        this.setState({ cheapestSort: !this.state.cheapestSort});
    }

    handleGetQuotes = async () => {
        await this.setState({currencySubmitted: this.state.currency, cheapestSort: true});
        Axios.get(`${process.env.REACT_APP_API_URL}/browsequotes/v1.0/${this.state.country?.Code ?? 'US'}/${this.state.currency?.Code ?? 'USD'}/en-US/${this.state.origin?.PlaceId}/${this.state.destination?.PlaceId}/${this.state.outbound}/${this.state.inbound}`,{
            headers: apiHeader
        }).then(res => this.setState({quotes: res.data.Quotes as Quote[], carriers: res.data.Carriers as Carrier[]}));
    }

    verifyDates = () => {
        var now = new Date();
        var timezoneString = `T00:00:00.000${now.getTimezoneOffset() / 60}`
        var outbound = new Date(`${this.state.outbound + timezoneString}`);
        var error: DateError= {
            inbound: false,
            outbound: false,
            message: []
        };
        
        if(this.state.roundtrip && this.state.inbound){
            var inbound = new Date(`${this.state.inbound + timezoneString}`);
            if(inbound < outbound){
                error.inbound = true;
                error.message.push('Outbound flight must occur before the inbound flight');
            }
           if(now > inbound){
                error.inbound = true;
                error.message.push('Inbound flight must occur in the future');
            }
        }
        if(now > outbound){
            error.outbound = true;
            error.message.push('Outbound flight must occur in the future');
        }
        this.setState({error, inbound:(error.inbound?'':this.state.inbound), outbound:(error.outbound?'':this.state.outbound)});
    }

    render() {
        return (
            <div className={styles.home}>
                <div className={styles.spacer}/>
                <section id={styles.card}>
                    <div id="error" className={styles.error} >{this.state.error?.message.join(',')}</div>
                    <div className={styles.flightType}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Flight Type</FormLabel>
                            <RadioGroup aria-label="flight-type" name="flight-type" value={this.state.roundtrip} onChange={this.handleFlightType}>
                                <FormControlLabel value={true} control={<Radio color="default" />} label="Roundtrip"/>
                                <FormControlLabel value={false} control={<Radio color="default" />} label="One-way"/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                <section id={styles.locations}>
                    <MarketContext.Consumer>
                        {market =>
                        (<div className={styles.location}>
                            <div className={styles.swap}>
                                <IconButton onClick={this.handleAirportSwap}>
                                    <SwapHorizIcon/>
                                </IconButton>
                                <p onClick={this.handleAirportSwap}>Swap Airports</p>
                            </div>
                            <div className={styles.locationSelect}>
                            {["Origin", "Destination"].map(source => (
                            <div key={source}>
                                <AsyncSelect
                                    placeholder={`${source} airport`}
                                    cachedOptions
                                    loadOptions={this.loadOptions}
                                    value={source==='Origin'?this.state.originOption:this.state.destinationOption}
                                    onChange={(value: Option | null, action) => {
                                        switch(source){
                                            case "Origin":
                                                this.setState({ originOption: value,origin: JSON.parse(value?.value || '') as Airport})
                                                break;
                                            case "Destination":
                                                this.setState({ destinationOption: value,destination: JSON.parse(value?.value || '') as Airport})
                                                break;
                                        }
                                    }}
                                />
                                  {source==="Origin"&&<><Autocomplete
                                    id="country-selector"
                                    className={styles.selector}
                                    options={market.Countries}
                                    getOptionLabel={(option) => option.Name}
                                    renderInput={(params) => <TextField {...params} label="Country of Origin" />} 
                                    onChange={this.handleCountryChange}/>
                                   
                                    </>}
                            </div>))}
                        </div>
                        </div>)} 
                    </MarketContext.Consumer>
                    </section>
                    <div className={styles.dates}>  
                        <TextField
                            className={styles.date}
                            label="Outbound date"
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={this.handleDateChange('outbound')}
                            value={this.state.outbound}
                        />
                        {this.state.roundtrip&&<TextField
                            className={styles.date}
                            label="Inbound date"
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={this.handleDateChange('inbound')}
                            value={this.state.inbound}
                        />}
                        <CurrencyContext.Consumer>
                                {currencies => <Autocomplete style={{width: '10ch', margin: '1rem 0'}}
                                    id="currency-selector"
                                    className={styles.selector}
                                    options={currencies.Currencies}
                                    getOptionLabel={(option) => option.Code}
                                    renderInput={(params) => <TextField {...params} label="Currency" />}
                                    onChange={this.handleCurrencyChange}
                                />}
                            </CurrencyContext.Consumer>
                        <span style={{flexGrow: 1}}/>
                        <IconButton className={styles.submit} onClick={this.handleGetQuotes}>
                            <SendIcon/>
                        </IconButton>
                    </div>
                </section>  
                {this.state.quotes&&
                    <section id={styles.Quotes}>
                        {this.state.quotes.length > 1?<>
                        <IconButton onClick={this.handleToggleSort}>
                            <SortIcon/>
                        </IconButton>  
                        {this.state.quotes.sort((a: Quote, b: Quote) => (this.state.cheapestSort?1:-1)*(a.MinPrice - b.MinPrice))
                            .map((quote: Quote, idx: number) => {
                                if(idx === 0 && this.state.cheapestSort){
                                    quote.cheapest = true;
                                }
                                return (<QuoteCard key={idx} {...quote} carriers={this.state.carriers} currency={this.state.currencySubmitted}/>)
                        })}
                        </>:<p className={styles.noAvailable}>No quotes avaliable for the selected dates</p>}
                    </section>}     
            </div>
        )
    }
}
