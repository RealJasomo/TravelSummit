import React, { Component } from 'react'
import { CurrencyContext, MarketContext } from '.'
import { IconButton, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import AsyncSelect from 'react-select/async'
import Axios from 'axios'

import { Airport, Country, Currency, DateError } from '../interfaces'

import SendIcon from '@material-ui/icons/Send'

import styles from '../css/home.module.css'
import { apiHeader } from './util/apiHeader'




interface HomeState{
    roundtrip: boolean,
    outbound: string,
    inbound: string,
    error?: DateError,
    country: Country | null,
    currency: Currency | null,
    origin: Airport | null,
    destination: Airport | null
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
            origin: null,
            destination: null
        }
    }

    loadOptions = async (query: string) => {
        const airports: Airport[] = await  Axios.get(
                `${process.env.REACT_APP_API_URL}/autosuggest/v1.0/${this.state.country?.Code ?? 'US'}/${this.state.currency?.Code ?? 'USD'}/en-US/`
                ,{
                    headers: apiHeader,
                    params: { query }
                }).then(res => res.data.Places);
        return airports.map(airport => ({
            label: `${airport.PlaceId} - ${airport.PlaceName}`,
            value: JSON.stringify(airport)
        }));
    }

    handleCountryChange = (_: React.ChangeEvent<{}>, country: Country | null) => {
        this.setState({ country });
    }

    handleFlightType = (event: React.ChangeEvent<HTMLInputElement>, value: string ) => {
        this.setState({roundtrip: value==='true'});
    }

    handleDateChange = <K extends keyof HomeState>(type: K) => async (event: React.ChangeEvent<HTMLInputElement>) =>{
       await this.setState({...this.state, [type]: event.currentTarget.value} as StateWrapper<HomeState>);
       this.verifyDates();
    }

    handleCurrencyChange = (event: React.ChangeEvent<{}>, currency: Currency | null) => {
        this.setState({ currency });
    }

    verifyDates = () => {
        var now = new Date();
        var outbound = new Date(this.state.outbound);
        var error: DateError= {
            inbound: false,
            outbound: false,
            message: []
        };
        
        if(this.state.roundtrip && this.state.inbound){
            var inbound = new Date(this.state.inbound);
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
            <div>
                <section id={styles.header}>
                    <h1>Explore, Travel, Fly</h1>
                </section>
                <section id={styles.dateSelector}>
                <section id={styles.locations}>
                    <MarketContext.Consumer>
                        {market =>
                        (<div className={styles.location}>
                             <CurrencyContext.Consumer>
                                {currencies => <Autocomplete style={{width: '10ch'}}
                                    id="currency-selector"
                                    className={styles.selector}
                                    options={currencies.Currencies}
                                    getOptionLabel={(option) => option.Code}
                                    renderInput={(params) => <TextField {...params} label="Currency" />}
                                    onChange={this.handleCurrencyChange}
                                />}
                            </CurrencyContext.Consumer>
                            <div className={styles.locationSelect}>
                            {["Origin", "Destination"].map(source => (
                            <div key={source}>
                                <p>{source}</p>
                                <AsyncSelect
                                    cachedOptions
                                    loadOptions={this.loadOptions}
                                    onChange={(value, action) => {
                                        switch(source){
                                            case "Origin":
                                                this.setState({ origin: JSON.parse(value?.value || '') as Airport})
                                                break;
                                            case "Destination":
                                                this.setState({ destination: JSON.parse(value?.value || '') as Airport})
                                                break;
                                        }
                                    }}
                                />
                                  {source==="Origin"&&<Autocomplete
                                    id="country-selector"
                                    className={styles.selector}
                                    options={market.Countries}
                                    getOptionLabel={(option) => option.Name}
                                    renderInput={(params) => <TextField {...params} label="Country of Origin" />} 
                                    onChange={this.handleCountryChange}/>}
                            </div>))}
                        </div>
                        </div>)} 
                    </MarketContext.Consumer>
                    </section>
                    <span id="error" className={styles.error} >{this.state.error?.message.join(',')}</span>
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Flight Type</FormLabel>
                        <RadioGroup aria-label="flight-type" name="flight-type" value={this.state.roundtrip} onChange={this.handleFlightType}>
                            <FormControlLabel value={true} control={<Radio color="default" />} label="Roundtrip"/>
                            <FormControlLabel value={false} control={<Radio color="default" />} label="One-way"/>
                        </RadioGroup>
                    </FormControl>
                    <div className={styles.dates}>  
                        <TextField
                            label="Outbound date"
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={this.handleDateChange('outbound')}
                            value={this.state.outbound}
                        />
                        {this.state.roundtrip&&<TextField
                            label="Inbound date"
                            type="date"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={this.handleDateChange('inbound')}
                            value={this.state.inbound}
                        />}
                        <IconButton className={styles.submit}>
                            <SendIcon/>
                        </IconButton>
                    </div>
                </section>        
            </div>
        )
    }
}
