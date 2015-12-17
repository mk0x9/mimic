import Emitter from 'api/emitter';
import EVENTS from 'api/constants/events';
import { PersistentStorage } from 'api/storage';
import { Scenario } from 'api/models/scenario';
import MockedRequests from 'api/mocked-requests';

export class Scenarios {

  constructor() {
    this.loadFromStorage();
    this._registerEvents();
  }

  _registerEvents() {
    Emitter.on(EVENTS.SCENARIO_CHANGE, this.loadFromStorage, this);
    Emitter.on(EVENTS.IMPORT, this.loadFromStorage, this);
  }

  loadFromStorage() {
    this.scenarios = PersistentStorage.dataTree.scenarios
      .map((scenario) => new Scenario(scenario));

    PersistentStorage.dataTree.scenarios = this.scenarios;

    this.setCurrentScenario(PersistentStorage.dataTree.currentScenario);
  }

  setCurrentScenario(scenarioId) {
    this.currentScenario = scenarioId;

    PersistentStorage.dataTree.currentScenario = scenarioId;
    PersistentStorage.persist();
  }

  getCurrentScenario() {
    if (this.currentScenario === 'MockedRequests') {
      return {
        name: this.currentScenario,
        mockedRequests: MockedRequests.mockedRequests.map((request) => ({
          mockedRequestId: request.id,
          selectedStateId: request.selectedStateId,
          active: request.active
        }))
      };
    }

    return this.getById(this.currentScenario);
  }

  getCurrentMockedRequests() {
    if (!this.getCurrentScenario()) {
      return [];
    }

    return this.getCurrentScenario().mockedRequests.map((request) => {
      const mockedRequest =  MockedRequests.mockedRequests
        .filter((_request) => _request.id === request.mockedRequestId)[0];

      Object.assign(mockedRequest, {
        active: request.active,
        selectedStateId: request.selectedStateId
      });

      return mockedRequest;
    });
  }

  getById(scenarioId) {
    return this.scenarios.filter((scenario) => scenario.id === scenarioId)[0];
  }

  getByName(scenarioName) {
    return this.scenarios.filter((scenario) => scenario.name === scenarioName)[0];
  }

  addMockedRequestToScenario(scenarioId, mockedRequestId) {
    this.getById(scenarioId).addMockedRequest(mockedRequestId);

    PersistentStorage.persist();
  }

  removeMockedRequestFromScenario(scenarioId, mockedRequestId) {
    this.getById(scenarioId).removeMockedRequest(mockedRequestId);

    PersistentStorage.persist();
  }

  addScenario(name) {
    this.scenarios.push(new Scenario({name}));

    PersistentStorage.persist();
  }

  renameScenario(scenarioId, newName) {
    this.getById(scenarioId).rename(newName);

    PersistentStorage.persist();
  }

  duplicateScenario(scenarioId) {
    const selectedScenario = this.getById(scenarioId);
    let name = `${ selectedScenario.name } copy`;
    while(this.getByName(name)) {
      name = `${ name } copy`;
    }
    const newScenario = {
      name: name,
      mockedRequests: selectedScenario.mockedRequests,
    };

    this.scenarios.push(new Scenario(newScenario));

    PersistentStorage.persist();
  }

  removeScenario(scenarioId) {
    const filtered = this.scenarios
      .filter((scenario) => scenario.id !== scenarioId);

    this.scenarios.splice(0, this.scenarios.length);

    filtered.forEach((scenario) => this.scenarios.push(scenario));

    PersistentStorage.persist();
  }

  mergeScenarios(scenarios) {
    for (const scenario of scenarios) {
      const existingScenario = this.getById(scenario.id);

      if (existingScenario) {
        Object.assign(existingScenario, scenario);
      } else {
        this.scenarios.push(new Scenario(scenario));
      }
    }
  }

  removeMockedRequestFromAllScenarios(mockedRequestId) {
    this.scenarios.forEach((scenario) => {
      scenario.removeMockedRequest(mockedRequestId);
    });

    PersistentStorage.persist();
  }

  selectStateInMockedRequestInScenario(scenarioId, mockedRequestId, stateId) {
    this.getById(scenarioId).selectStateInMockedRequest(mockedRequestId, stateId);

    PersistentStorage.persist();
  }

  toggleMockedRequestInScenario(scenarioId, mockedRequestId) {
    this.getById(scenarioId).toggleMockedRequest(mockedRequestId);

    PersistentStorage.persist();
  }
}

export default new Scenarios();