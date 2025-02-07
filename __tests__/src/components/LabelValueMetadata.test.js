import React from 'react';
import { shallow } from 'enzyme';
import Typography from '@material-ui/core/Typography';
import { LabelValueMetadata } from '../../../src/components/LabelValueMetadata';
import SanitizedHtml from '../../../src/containers/SanitizedHtml';

describe('LabelValueMetadata', () => {
  let wrapper;
  let labelValuePair;

  describe('when the labelValuePair has content', () => {
    beforeEach(() => {
      labelValuePair = [
        {
          label: 'Label 1',
          values: ['Value 1'],
        },
        {
          label: 'Label 2',
          values: ['Value 2'],
        },
      ];
      wrapper = shallow(
        <LabelValueMetadata labelValuePairs={labelValuePair} />,
      );
    });

    it('renders a dt/dd for each label/value pair', () => {
      expect(wrapper.find('dl').length).toEqual(1);
      expect(wrapper.find(Typography).find('[component="dt"]').length).toEqual(2);
      expect(wrapper.find(Typography).find('[component="dd"]').length).toEqual(2);
    });

    it('renders correct labels in dt', () => {
      expect(wrapper.find(Typography).find('[component="dt"]').first().children()
        .text()).toEqual('Label 1');
      expect(wrapper.find(Typography).find('[component="dt"]').last().children()
        .text()).toEqual('Label 2');
    });

    it('renders SanitizedHtml component in dt for each value', () => {
      expect(wrapper.find(Typography).find('[component="dd"]').first().find(SanitizedHtml).length).toBe(1);
      expect(wrapper.find(Typography).find('[component="dd"]').last().find(SanitizedHtml).length).toBe(1);
    });

    it('passes value string to SanitizedHtml', () => {
      expect(wrapper.find(SanitizedHtml).first().props().htmlString).toBe('Value 1');
      expect(wrapper.find(SanitizedHtml).last().props().htmlString).toBe('Value 2');
    });
  });

  describe('when the labelValuePair has no content', () => {
    beforeEach(() => {
      labelValuePair = [];
      wrapper = shallow(
        <LabelValueMetadata labelValuePairs={labelValuePair} />,
      );
    });

    it('renders an empty fragment instead of an empty dl', () => {
      expect(wrapper.find('dl').length).toEqual(0);
      expect(wrapper.isEmptyRender()).toBe(true);
    });
  });

  describe('when the labelValuePair has a default label', () => {
    beforeEach(() => {
      labelValuePair = [
        {
          values: ['Value 1'],
        },
        {
          label: 'Label 2',
          values: ['Value 2'],
        },
      ];
      wrapper = shallow(
        <LabelValueMetadata labelValuePairs={labelValuePair} defaultLabel="Default label" />,
      );
    });

    it('renders correct labels in dt', () => {
      expect(wrapper.find(Typography).find('[component="dt"]').first().children()
        .text()).toEqual('Default label');
      expect(wrapper.find(Typography).find('[component="dt"]').last().children()
        .text()).toEqual('Label 2');
    });
  });
});
