import React, { Component } from 'react'
import { Carrier, Currency, Quote } from '../interfaces'

import styles from '../css/quote-card.module.css'

interface QuoteCardProps extends Quote {
    carriers: Carrier[] | null,
    currency: Currency | null
}
export default class QuoteCard extends Component<QuoteCardProps, {}> {
  
    render() {
        const carriers = (type: string) =>{
            var carriers: (Carrier|undefined)[] = [];
            var leg = (type === 'Outbound')?this.props.OutboundLeg:this.props.InboundLeg;
            leg?.CarrierIds.forEach((id: number) => {
               carriers.push(this.props.carriers?.find(element => element.CarrierId === id));
            });
            return carriers.map(el => el?.Name).join(' ');
        }
        const priceString = (price: number): string => {
            if(this.props.currency){
              const { SymbolOnLeft , Symbol, SpaceBetweenAmountAndSymbol, Code} = this.props.currency;
              if(SymbolOnLeft){
                return `${Symbol}${SpaceBetweenAmountAndSymbol?' ':''}${price} ${Symbol==='$'?Code:''}`.trim();
              }else{
                return `${price}${SpaceBetweenAmountAndSymbol?' ':''}${Symbol} ${Symbol==='$'?Code:''}`.trim();
              }
            }
            else{
                return `$${price} USD`;
            }
        }
        return (
            <div className={`${styles.card} ${this.props.cheapest&&styles.cheapest}`}>
                {this.props.cheapest&&<p className={styles.cheapText}>Cheapest</p>}
                {!this.props.Direct &&<p className={styles.layover}>Includes layover</p>}
                <p className={styles.cost}>{priceString(this.props.MinPrice)}</p>
                <div className={styles.legs}>
                    {(this.props.InboundLeg?['Outbound', 'Inbound']:['Outbound']).map( type =>
                        (<div key={type} className={styles.legDetail}>
                            <p className={styles.detail}>{type} Details:</p>        
                            <p className={styles.carrier}>Carriers: {carriers(type)}</p>
                        </div>))}              
                </div>  
            </div>
        )
    }
}
