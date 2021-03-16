import React, {createContext, Component} from 'react'
import Axios from 'axios'

import { apiHeader } from '../util/apiHeader'
import { Currency } from '../../interfaces'

interface CurrencyState {
    Currencies: Currency[]
}

export const CurrencyContext: React.Context<CurrencyState> = createContext<CurrencyState>({Currencies: []});


export default class CurrencyContextProvider extends Component<{}, CurrencyState>{
    constructor(props: {}){
        super(props);
        this.state = {
            Currencies: []
        }
    }

    componentDidMount(){
        Axios.get(`${process.env.REACT_APP_API_URL}/reference/v1.0/currencies`, {
            headers : apiHeader
        }).then(response => this.setState(response.data));
    }

    render(){
        return (
            <CurrencyContext.Provider value={this.state}>
                {this.props.children}
            </CurrencyContext.Provider>
        )
    }
}