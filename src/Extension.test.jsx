import React from 'react';
import ReactDOM from 'react-dom';
import { mount, ReactWrapper } from 'enzyme';
import { Extension } from './Extension';
import { JSDOM } from 'jsdom';
import store from '@imeredith/es-extensions-api';


const dom = new JSDOM('');
global.window = dom.window;
test('Event bus rerenders', () => {
    let firstExt = 0;
    
    let secondExt = 0;

    store.register('test', () => firstExt++);
    const tree = mount (<Extension extensionPointId="test"/>);
    expect(firstExt).toBe(1);
    
    store.register('test', () => secondExt++);
    expect(firstExt).toBe(2); 
    expect(secondExt).toBe(1);
    
    tree.update()
    
    expect(tree.find('div.extension_container > div').length).toBe(2);
})

test('extension renders', () => {
    const Ext = (props) => <div>Hello {props.name}</div>;

    store.register("test1", ({container}) => {
        ReactDOM.render(<Ext name="world"/>, container);
    });

    const tree = mount (<Extension extensionPointId="test1"/>, { attachTo: dom.window.document.body });

    expect(tree).toHaveText('Hello world');
})