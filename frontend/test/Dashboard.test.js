import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount, render } from 'enzyme';
import { Dashboard } from 'Dashboard/Dashboard';
import testData from 'Mockup/familyData.json'

describe.only('Test Dashboard Component', function () {
  describe('Initial component state', function () {
    it('renders properly', function () {
      const fetchFamilyData = () => testData;
      let context = { router: {} };

      const wrapper = mount(
        <Dashboard
          data={testData.data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      expect(wrapper.find('Dashboard')).to.have.length(1);
    });

    it('contains data payload on mount', function () {
      const fetchFamilyData = () => testData;
      let context = { router: {} };

      const wrapper = mount(
        <Dashboard
          data={testData.data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      const dashboardProps = wrapper.props();
      const { data } = dashboardProps;

      expect(data).to.have.length(100);
    });

    it('contains corrent initial component state', function () {
      const fetchFamilyData = () => testData;
      let context = { router: {} };

      const wrapper = mount(
        <Dashboard
          data={testData.data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      const dashboardState = wrapper.state();
      const { sortBy } = dashboardState;

      const firstSortByStateItem = {
        order: 0,
        stateColName: '',
        asc: false,
        dsc: false
      };

      expect(sortBy).to.have.length(3);
      expect(sortBy[0]).to.deep.equal(firstSortByStateItem)
    });
  });

  describe('Component sort function', function () {
    it('calls click handler on column header', function () {
      const fetchFamilyData = () => testData;
      let context = { router: {} };

      const wrapper = mount(
        <Dashboard
          data={testData.data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      wrapper.setProps({ data: testData.data });

      const nameTableHeader = wrapper.find('#sort-name');
      expect(nameTableHeader).to.have.length(1);

      const toggleSortState = sinon.stub(wrapper.instance(), 'toggleSortState');

      expect(toggleSortState.called).to.be.false;
      nameTableHeader.simulate('click');

      expect(toggleSortState.called).to.be.true;
      expect(toggleSortState.firstCall.args[1]).to.equal('name');

      toggleSortState.reset();

      const cityTableHeader = wrapper.find('#sort-city');
      expect(cityTableHeader).to.have.length(1);

      expect(toggleSortState.called).to.be.false;
      cityTableHeader.simulate('click');

      expect(toggleSortState.called).to.be.true;
      expect(toggleSortState.firstCall.args[1]).to.equal('city');
    })

    it('clicking table headers once sorts data in ascending order', function () {
      const fetchFamilyData = sinon.spy()
      let context = { router: {} };

      const data = [
        {
          "id": 95,
          "name": "Mahmud",
          "family": "Beacom",
          "city": "Kutampi",
          "score": 1880
        }, {
          "id": 93,
          "name": "Anatole",
          "family": "Colleck",
          "city": "Bandhagen",
          "score": 210
        }, {
          "id": 94,
          "name": "Fielding",
          "family": "Flawith",
          "city": "Sirnasari",
          "score": 1860
        },{
          "id": 1,
          "name": "Bone",
          "family": "Yandell",
          "city": "Zeleneč",
          "score": 200
        }
      ]

      const wrapper = mount(
        <Dashboard
          data={data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      wrapper.setProps({ data });

      let dashboardState = wrapper.state();

      expect(dashboardState.data).to.deep.equal(data);
      expect(dashboardState.data).to.have.length(4);

      const nameTableHeader = wrapper.find('#sort-name');
      expect(nameTableHeader).to.have.length(1);

      nameTableHeader.simulate('click');

      dashboardState = wrapper.state();

      const firstDataPoint = dashboardState.data[0];
      const secondDataPoint = dashboardState.data[1];
      const thirdDataPoint = dashboardState.data[2];
      const fourthDataPoint = dashboardState.data[3];

      expect(firstDataPoint.name < secondDataPoint.name && secondDataPoint.name < thirdDataPoint.name && thirdDataPoint.name < fourthDataPoint.name).to.be.true;
    })

    it('clicking table headers twice sorts data in descending order', function () {
      const fetchFamilyData = sinon.spy()
      let context = { router: {} };

      const data = [
        {
          "id": 95,
          "name": "Mahmud",
          "family": "Beacom",
          "city": "Kutampi",
          "score": 1880
        }, {
          "id": 93,
          "name": "Anatole",
          "family": "Colleck",
          "city": "Bandhagen",
          "score": 210
        }, {
          "id": 94,
          "name": "Fielding",
          "family": "Flawith",
          "city": "Sirnasari",
          "score": 1860
        },{
          "id": 1,
          "name": "Bone",
          "family": "Yandell",
          "city": "Zeleneč",
          "score": 200
        }
      ]

      const wrapper = mount(
        <Dashboard
          data={data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      wrapper.setProps({ data });

      let dashboardState = wrapper.state();

      expect(dashboardState.data).to.deep.equal(data);
      expect(dashboardState.data).to.have.length(4);

      const familyTableHeader = wrapper.find('#sort-family');
      expect(familyTableHeader).to.have.length(1);

      familyTableHeader.simulate('click');
      familyTableHeader.simulate('click');

      dashboardState = wrapper.state();

      const firstDataPoint = dashboardState.data[0];
      const secondDataPoint = dashboardState.data[1];
      const thirdDataPoint = dashboardState.data[2];
      const fourthDataPoint = dashboardState.data[3];

      expect(firstDataPoint.family > secondDataPoint.family && secondDataPoint.family > thirdDataPoint.family && thirdDataPoint.family > fourthDataPoint.family).to.be.true;
    });

    it('clicking table headers three times returns data to an unsorted state', function () {
      const fetchFamilyData = sinon.spy()
      let context = { router: {} };

      const data = [
        {
          "id": 95,
          "name": "Mahmud",
          "family": "Beacom",
          "city": "Kutampi",
          "score": 1880
        }, {
          "id": 93,
          "name": "Anatole",
          "family": "Colleck",
          "city": "Bandhagen",
          "score": 210
        }, {
          "id": 94,
          "name": "Fielding",
          "family": "Flawith",
          "city": "Sirnasari",
          "score": 1860
        },{
          "id": 1,
          "name": "Bone",
          "family": "Yandell",
          "city": "Zeleneč",
          "score": 200
        }
      ]

      const wrapper = mount(
        <Dashboard
          data={data}
          fetchFamilyData={fetchFamilyData}
        />,
        { context }
      );

      wrapper.setProps({ data });

      let dashboardState = wrapper.state();

      expect(dashboardState.data).to.deep.equal(data);
      expect(dashboardState.data).to.have.length(4);

      const cityTableHeader = wrapper.find('#sort-city');
      expect(cityTableHeader).to.have.length(1);

      cityTableHeader.simulate('click');
      cityTableHeader.simulate('click');
      cityTableHeader.simulate('click');

      dashboardState = wrapper.state();

      const firstDataPoint = dashboardState.data[0];
      const secondDataPoint = dashboardState.data[1];
      const thirdDataPoint = dashboardState.data[2];
      const fourthDataPoint = dashboardState.data[3];

      expect(firstDataPoint.city > secondDataPoint.city && secondDataPoint.city > thirdDataPoint.city && thirdDataPoint.city > fourthDataPoint.city).to.be.false;
      expect(firstDataPoint.city < secondDataPoint.city && secondDataPoint.city < thirdDataPoint.city && thirdDataPoint.city < fourthDataPoint.city).to.be.false;
    });
  });
});
