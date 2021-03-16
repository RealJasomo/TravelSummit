import React, { Component } from 'react'
import { CurrencyContext, MarketContext } from '.'
import { IconButton, TextField, RadioGroup, FormControlLabel, Radio, FormLabel, FormControl } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import AsyncSelect from 'react-select/async'

import { DateError, Currency } from '../interfaces'

import SendIcon from '@material-ui/icons/Send'

import styles from '../css/home.module.css'




interface HomeState{
    roundtrip: boolean,
    outbound: string,
    inbound: string,
    error?: DateError,
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
            inbound: ''
        }
    }

    loadOptions = (input: string, callback: Function) => {
        callback([]);
    }

    handleFlightType = (event: React.ChangeEvent<HTMLInputElement>, value: string ) => {
        this.setState({roundtrip: value==='true'});
    }

    handleDateChange = <K extends keyof HomeState>(type: K) => async (event: React.ChangeEvent<HTMLInputElement>) =>{
       await this.setState({...this.state, [type]: event.currentTarget.value} as StateWrapper<HomeState>);
       this.verifyDates();
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
                <section id={styles.locations}>
                    <MarketContext.Consumer>
                        {market =>
                        (<>
                            <Autocomplete
                                id="country-selector"
                                className={styles.selector}
                                options={market.Countries?.map(i=>i.Code)}
                                renderInput={(params) => <TextField {...params} label="Country" />} />

                            <AsyncSelect
                                cachedOptions
                                loadOptions={this.loadOptions}
                                defaultOptions
                                />
                            <AsyncSelect
                                cachedOptions
                                loadOptions={this.loadOptions}
                                defaultOptions
                                />
                        </>)}
                    </MarketContext.Consumer>
                </section>
                <section id={styles.dateSelector}>
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
                        <CurrencyContext.Consumer>
                            {currencies => <Autocomplete style={{width: '10ch'}}
                                id="currency-selector"
                                className={styles.selector}
                                options={currencies.Currencies?.map( (i: Currency ) => i.Code)}
                                renderInput={(params) => <TextField {...params} label="Currency" />}
                            />}
                        </CurrencyContext.Consumer>
                        <IconButton className={styles.submit}>
                            <SendIcon/>
                        </IconButton>
                    </div>
                </section>        
            </div>
        )
    }
}
