import React from 'react';
import ReactDOM from 'react-dom';
import { mocked } from 'ts-jest/utils';

import { Identity, SkillApi, UserSkill, User } from '../../api/skill-api';
import { initialAppState } from '../../store/app.state';
import { Ajax } from '../../api/ajax';
import { ProfilePage } from './profile-page';

jest.mock('../../api/skill-api');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockImplementation(() => ({ skill: 'jquery' })),
  useHistory: jest.fn(),
}));

describe('Proflie page tests', () => {
  beforeEach(() => {
    const testUser = { name: 'Test' } as User;
    const ajaxOfUser: Partial<Ajax<User>> = {
      send: () => Promise.resolve(testUser),
      abort: jest.fn(),
    };
    const ajaxOfUserSkill: Partial<Ajax<UserSkill[]>> = {
      send: () => Promise.resolve([] as UserSkill[]),
      abort: jest.fn(),
    };
    mocked(SkillApi.getUser).mockImplementation(() => ajaxOfUser as Ajax<User>);
    mocked(SkillApi.getUserSkills).mockImplementation(
      () => ajaxOfUserSkill as Ajax<UserSkill[]>
    );
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    const identity: Identity = { name: 'test', fullName: 'Test User' };
    const profile = initialAppState.profile;

    ReactDOM.render(
      <ProfilePage dispatch={() => {}} identity={identity} profile={profile} />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});