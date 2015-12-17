import uuid from 'uuid';
import MockedRequests from 'api/mocked-requests';

export class Scenario {

  constructor({ id = uuid.v4(), name, mockedRequests = [] }) {
    Object.assign(this, { id, name, mockedRequests });
  }

  rename(newName) {
    this.name = newName;
  }

  addMockedRequest(mockedRequestId) {
    const { selectedStateId, active } = MockedRequests.findById(mockedRequestId);

    this.mockedRequests.push({ mockedRequestId, selectedStateId, active });
  }

  removeMockedRequest(mockedRequestId) {
    this.mockedRequests.forEach((request, index) => {
      if (request.mockedRequestId === mockedRequestId) {
        return this.mockedRequests.splice(index, 1);
      }
    });
  }

  findMockedRequestById(mockedRequestId) {
    return this.mockedRequests
      .filter((request) => request.mockedRequestId === mockedRequestId)[0];
  }

  selectStateInMockedRequest(mockedRequestId, stateId) {
    this.findMockedRequestById(mockedRequestId).selectedStateId = stateId;
  }

  toggleMockedRequest(mockedRequestId) {
    const mockedRequest = this.findMockedRequestById(mockedRequestId);

    mockedRequest.active = !mockedRequest.active;
  }
}