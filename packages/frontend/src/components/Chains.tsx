import * as React from 'react';
import { Connection } from '../Connection';
import { Icon } from './Icon';
import { Types, Maybe } from '@dotstats/common';

import chainIcon from '../icons/link.svg';
import './Chains.css';

interface ChainData {
  label: Types.ChainLabel;
  nodeCount: Types.NodeCount;
}

export namespace Chains {
  export interface Props {
    chains: Map<Types.ChainLabel, Types.NodeCount>,
    subscribed: Maybe<Types.ChainLabel>,
    connection: Promise<Connection>
  }
}

export class Chains extends React.Component<Chains.Props, {}> {
  public render() {
    return (
      <div className="Chains">
        <Icon src={chainIcon} alt="Observed chain" />
        {
          this.chains.map((chain) => this.renderChain(chain))
        }
      </div>
    );
  }

  private renderChain(chain: ChainData): React.ReactNode {
    const { label, nodeCount } = chain;

    const className = label === this.props.subscribed
      ? 'Chains-chain Chains-chain-selected'
      : 'Chains-chain';


    return (
      <a key={label} className={className} onClick={this.subscribe.bind(this, label)}>
        {label} ({nodeCount})
      </a>
    )
  }

  private get chains(): ChainData[] {
    return Array
      .from(this.props.chains.entries())
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .map(([label, nodeCount]) => ({ label, nodeCount }));
  }

  private async subscribe(chain: Types.ChainLabel) {
    const connection = await this.props.connection;

    connection.subscribe(chain);
  }
}
