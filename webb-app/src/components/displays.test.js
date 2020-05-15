import React from 'react';
import {shallow} from 'enzyme';
import Diplays from './displays';
describe('routes using array of routers', () => {
    let component;
    beforeAll(() => {
      component = shallow(<Diplays/>);
      
    });
    it('contains the correct title', () => {
      expect(component.find('h2').text()).toBe('About');
    });
    it('contains the correct text', ()=> {
        expect(component.find('p').text()).toContain('Lorem ipsum dolor sit amet, morbi facilisis');
    });
  });