import React from 'react';
import Enzyme from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

import App from './components/app_container';
import Sidebar from './components/sidebar/sidebar';
import SidebarElement from './components/sidebar_element/sidebar_element';

Enzyme.configure({ adapter: new Adapter() });

describe('Render Test', () => {
  it('App render check', () => {
    const output = Enzyme.shallow( <App />);
    expect(shallowToJson(output)).toMatchSnapshot();
  });
  it('Sidebar render check', () => {
    const output = Enzyme.shallow( <Sidebar points={[]} />);
    expect(shallowToJson(output)).toMatchSnapshot();
  });
  it('SidebarElement render check', () => {
    const output = Enzyme.shallow( <SidebarElement point={{coordinates:[10,30], name: "", color: ""}} />);
    expect(shallowToJson(output)).toMatchSnapshot();
  });
});

describe('Sidebar Click Test', () => {
  const mockCallBack = jest.fn();
  const output = Enzyme.mount( <Sidebar points={[]} addNewPoint={mockCallBack} resetAllPoints={mockCallBack}/>);
    it('point add check', () => {
      output.find('.sidebar-add').simulate('click', {preventDefault: () => {}})
      expect(mockCallBack.mock.calls.length).toEqual(1);
      expect(mockCallBack.mock.calls[0][0]).toBe("");
    });
    it('reset points check', () => {
      output.find('.sidebar_reset').simulate('click', () => {
        expect(mockCallBack.mock.calls.length).toEqual(1);
      })
    });
});

describe('SidebarElement Event Test', () => {
  const mockCallBack = jest.fn();
  const output = Enzyme.mount( <SidebarElement point={{coordinates:[10,30], name: "", color: ""}} deletePoint={mockCallBack} onDragStart={mockCallBack}/> );
  it('delete click check', () => {
    output.find('.sidebar_element_button').simulate('click', () => {
      console.log('dasdw')
      expect(mockCallBack.mock.calls.length).toEqual(1);
      expect(mockCallBack.mock.calls[0][0]).toBe("");
    })
  });
  it('drugstart test', () => {
    output.find('.sidebar_element').simulate('dragstart', () => {
      expect(mockCallBack.mock.calls.length).toEqual(1);
      expect(mockCallBack.mock.calls[0][1]).toBe(Number);
    })
  });
});

describe('App test', () => {

  const output = Enzyme.mount( <App /> );
  const instance = output.instance();

  it('add point out of state', () => {
    instance.addNewPoint("name");
    expect(output.state('points').length).toEqual(1);
  })

  it('update point', () =>{
    instance.updatePointCoords([10,30], 0);
    expect(output.state('points')[0].coordinates).toEqual([10,30]);
  })

  it('delete point', ()=>{
    instance.deletePoint(0);
    expect(output.state('points').length).toEqual(0);
  })
  
  it('delete all points', () => {
    for(let i=0; i < 10; i++){
      instance.addNewPoint('');
    }
    expect(output.state('points').length).toEqual(10);
    instance.resetAllPoints();
    expect(output.state('points').length).toEqual(0);
  })
})
