import React from 'react';

export class Editor extends React.Component {
    render(){
        return (
            <div id="container" style="height:100%">
                <textarea id="editor" style="width:100%; height:100%">
                    {{Персона}}
                    '''Леопольд''' — подлый трус!
                </textarea>
            </div>
        );
    }
}
