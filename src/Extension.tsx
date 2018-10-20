import * as React from 'react';
import store, { Subscription } from '@imeredith/es-extensions-api';

interface Props {
    extensionPointId: string
    context?: any
    containerClassName?: string
    keyPrefix?: string
}

interface State {
    extensions: Function[]
}

const Container: React.SFC<Props> = (props) => <div className={`extension_container ${props.containerClassName || ''}`.trim()}>{props.children}</div>

export class Extension extends React.Component<Props, State> {
    private subscription: Subscription | undefined;
    constructor(props: Props) {
        super(props);
        this.state = { extensions: store.getExtensions(this.props.extensionPointId) };
    }

    componentDidMount() {
        this.subscription = store.subscribe(this.props.extensionPointId, (extensions: Function[]) => this.setState({ extensions }))
    }

    componentWillUnmount() {
        if(this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    render() {
        const exts = this.state.extensions;
        if(!exts || exts.length == 0) {
            return <Container {...this.props}>{this.props.children}</Container>
        }
        return <Container {...this.props}>
           {exts.map((extension: any, index: number) => 
            <div key={`${this.props.keyPrefix}${index.toString()}`} 
                ref={container => {
                    if(container) {
                        extension({...this.props.context, container})
                    }
                    }
                }

                />)}
        </Container>
        
     
    }
}