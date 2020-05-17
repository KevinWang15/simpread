console.log( "=== simpread plugin bar load ===" )

import {storage} from 'storage';

import Button    from 'button';

export default class Pluginbar extends React.Component {

    state = {
        category: []
    };

    category = {};

    getCategory() {
        Object.values( storage.plugins ).forEach( ( item, idx ) => {
            if ( this.category[item.category] ) {
                this.category[item.category].push( item );
            } else {
                this.category[item.category] = [];
                this.category[item.category].push( item );
            }
        });
        this.setState({ category: Object.keys( this.category ) });
    }

    componentWillMount() {
    }

    render() {
        const child = this.state.category.map( item => {

            const actions = this.category[item].map( plugin => {
                const bgColor = ( plugin.enable == undefined || plugin.enable == true ) ? plugin.icon.bgColor : "#c3c6c7";
                plugin.enable == undefined && ( plugin.enable = true );
                return (
                    <Button ref={plugin.id}
                            shape="circle" type="flat"
                            color={ plugin.icon.color } backgroundColor={ bgColor }
                            tooltip={{ text: plugin.name }}
                            fontIcon={ plugin.icon.type }
                            waves="md-waves-effect md-waves-button"
                            onClick={ ()=>this.enable(plugin.id) } />
                )
            });

            return (
                <sr-opt-gp>
                    <sr-opt-label>{ item }</sr-opt-label>
                    <actions style={{ display: "flex", margin: "10px 0" }}>{ actions }</actions>
                </sr-opt-gp>
            )
        });

        if ( child.length == 0 ) {
            child.push( <plugin-bar-empty style={{'font-size':'17px!important','color': 'rgba(51, 51, 51, 0.87)!important'}} dangerouslySetInnerHTML={{__html: `暂无任何可用插件<br>请通过「选项页 → 插件管理」添加。` }}></plugin-bar-empty> );
        }

        return (
            <plugin-bar>{child}</plugin-bar>
        )
    }
}