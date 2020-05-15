import React from 'react';
import {shallow} from 'enzyme';
import App from './App'
import About from './components/about';
import Home from './components/home';
import { Route } from 'react-router-dom';
import Displays from './components/displays';

let pathMap = {};
describe('routes using array of routers', () => {
  beforeAll(() => {
    const component = shallow(<App/>);
    pathMap = component.find(Route).reduce((pathMap, route) => {
        const routeProps = route.props();
        pathMap[routeProps.path] = routeProps.component;
        return pathMap;
      }, {});
  })
  it('should show Displays component for / router (getting array of routes)', () => {

    expect(pathMap['/']).toBe(Displays);
  })
  it('should show About component for /about router', () => {
    expect(pathMap['/about']).toBe(About);
  })
  it('should show Home component techdomain for /news router', () => {
    expect(pathMap['/message']).toBe(Home);
  })
})