import React from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";
import { newContextComponents } from "@drizzle/react-components";
import "./App.css";
import Web3 from "web3";
import poemContract from "./artifacts/poemContract.json";

const { AccountData, ContractData, ContractForm } = newContextComponents;
const options = {
  web3: {
    block: false,
    customProvider: new Web3(Web3.givenProvider || "ws://localhost:7545"),
  },
  contracts: [poemContract],
  events: {

  },
};

const drizzle = new Drizzle(options);

class GetPoemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit = event => {
    this.props.callback(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
        <p> Enter the number of the poem to fetch </p>

        <form onSubmit={this.handleSubmit}>
          <label>
            {"Enter the poem number: \t"}
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class GetPoemContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  handleSubmit(event) {
    this.props.callback(this.state.value);
    event.preventDefault();
  }
  render() {
    return (
      <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
        <p> Enter the name of the poem to fetch </p>

        <form onSubmit={this.handleSubmit}>
          <label>
            {"Enter the poem name: \t"}
            <textarea value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

class GetPoemContentDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lookupPoem: "nimi",
    };
    this.updateDisplayed = this.updateDisplayed.bind(this);
  }
  updateDisplayed(newLookupPoem) {
    this.setState({ lookupPoem: newLookupPoem });
  }
  render() {
    return (<div>
      <GetPoemContent callback={this.updateDisplayed} />
      <strong>Fetched poem: </strong>
      {(this.state.lookupPoem.length === 0)
        ?
        <div style={{ color: "yellow" }}>String is empty!</div>
        :
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            return (
              <ContractData
                drizzle={drizzle}
                drizzleState={drizzleState}
                contract="poemContract"
                method="poemContentByName"
                methodArgs={[this.state.lookupPoem]}
              />
            );
          }}

        </DrizzleContext.Consumer>
      }
    </div>);
  }
}


class GetPoemDisplayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lookupName: "0",
    };
    this.updateDisplayed = this.updateDisplayed.bind(this);
  }

  updateDisplayed(newLookupName) {
    this.setState({ lookupName: newLookupName });
  }

  render() {
    return (
      <div>
        <GetPoemForm callback={this.updateDisplayed} />
        <strong>Fetched poem name: </strong>
        {isNaN(Number(this.state.lookupName))
          ? // conditional rendering
          <div style={{ color: "red" }}>A number, please!</div>
          :
          <DrizzleContext.Consumer>
            {drizzleContext => {
              const { drizzle, drizzleState, initialized } = drizzleContext;

              return (
                <ContractData
                  drizzle={drizzle}
                  drizzleState={drizzleState}
                  contract="poemContract"
                  method="getPoemName"
                  methodArgs={[this.state.lookupName]}
                />
              );
            }}

          </DrizzleContext.Consumer>
        }
      </div>
    );
  }
}


class DrizzleReactComponent extends React.Component {

  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            if (!initialized) {
              return "Loading..."
            }

            return (
              <div className="App">
                <div>
                  <h1>Blockchain poems</h1>
                </div>

                <div className="section">
                  <h2>Account data:</h2>
                  <AccountData
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    accountIndex={0}
                    units="ether"
                    precision={3}
                  />
                </div>
                <div className="section">
                  <h2>Poem Contract interface</h2>
                  <p>
                    Currently it stores and adds some templates. From the field below, you can add more poems with a given name.
                  </p>

                  <ContractForm
                    drizzle={drizzle}
                    contract="poemContract"
                    method="addPoem"
                    sendArgs={{ gas: 500000 }} />

                  <p>
                    <strong>Total poems authored: </strong>
                    <ContractData
                      drizzle={drizzle}
                      drizzleState={drizzleState}
                      contract="poemContract"
                      method="getMyPoemCount"
                    />
                  </p>


                </div>
                <GetPoemDisplayer />
                <GetPoemContentDisplayer />
              </div>
            )
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    )
  }

}

function App() {
  return (
    <div>
      <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
        <DrizzleReactComponent />
      </div>


    </div>

  );
}

export default App;
