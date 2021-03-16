import React, {createContext, Component} from 'react'
import Axios from 'axios'

import { apiHeader } from '../util/apiHeader'
import { Country } from '../../interfaces'

interface MarketState {
    Countries: Country[]
}

export const MarketContext: React.Context<MarketState> = createContext<MarketState>({Countries: []});

export default class MarketContextProvider extends Component<{}, MarketState>{
    constructor(props: {}){
        super(props);
        this.state = {
            Countries: []
        }
    }

    componentDidMount(){
        Axios.get(`${process.env.REACT_APP_API_URL}/reference/v1.0/countries/en-US`,{
            headers: apiHeader
        }).then(response => this.setState(response.data));
    }

    render(){
        return (
            <MarketContext.Provider value={this.state}>
                {this.props.children}
            </MarketContext.Provider>
        )
    }
}